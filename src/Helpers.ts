import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

export default class Helpers {

    public static scopeRegex: string = Helpers.recursiveRegex("(\\s*\\{)([^\\{\\}]|(?R))*\\}");

    public static templateRegex: string = "((template\\s*<([\\w\\d_\\,\\s\\.\\=]*)>)[\\s\\r\\n]*)?";

    /**
     * Convert template complete string to parameter names only.
     *
     * @example template<typename T1, typename T2>  --->  T1, T2
     *
     * @param template
     */
    public static templateNames(template: string) : Array<string> {
        return this.templateParameters(Helpers.removeArgumentDefault(template)).map(function (templ) {
            let match:any;
            if (match =  /^(([\w_][\w\d_]*\s+)+)([\w_][\w\d_]*)$/g.exec(templ)) {
                return match[3];
            }
            return templ;
        });
    }

    /**
     * Convert template complete string to parameter names with types only.
     *
     * @example template<typename T1, typename T2>  --->  typename T1, typename T2
     *
     * @param template
     */
    public static templateParameters(template: string) : Array<string> {
        template = template.replace(/^\s*template\s*</, '');
        template = template.replace(/>$/, '');
        if (template.length === 0) {
            return [];
        }
        return template.split(',').map((templ) => templ.trim());
    }

    /**
     * Returns space based on Indeting config for active editor.
     */
    public static spacer() {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.options.insertSpaces) {
            return ' '.repeat(<number>editor.options.tabSize);
        }
        return '\t';
    }

    /**
     * Indent code.
     *
     * @param str
     * @param count
     */
    public static indent(str: string, count: number = 1): string {
        if (str.match(/^(\r\n|\r|\n)/g)) {
            return str.replace(/(\r\n|\r|\n)/g, '\n' + this.spacer().repeat(count)).replace(/\n\s+$/g, '\n');
        }
        return this.spacer().repeat(count) + str.replace(/(\r\n|\r|\n)/g, '\n' + this.spacer().repeat(count)).replace(/\n\s+$/g, '\n');
    }

    /**
     * Opens source file of a active header file editor.
     */
    public static openSourceFile(): Promise<vscode.TextEditor> {
        let patterns: any = vscode.workspace.getConfiguration("CppHelper").get<Array<string>>('SourcePattern');
        let replacements: Array<{find:string, replace:string}> = vscode.workspace.getConfiguration("CppHelper").get("FindReplaceStrings") as Array<{find:string, replace:string}>;
        let notFoundBehavior: any = vscode.workspace.getConfiguration("CppHelper").get<string>('SourceNotFoundBehavior');
        return new Promise(function (resolve, reject) {
            let fileName = vscode.window.activeTextEditor?.document.fileName;
            if (fileName) {
                let name = fileName.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '');
                const directory = fileName.replace(/[\\\/][^\\\/]+$/, '');
                let extension = fileName.split('.').pop();
                for (let i in patterns) {
                    if (typeof patterns[i] === 'string') {
                        let fileToOpen: string = "";
                        if (patterns[i][0] === '/') {
                            fileToOpen = vscode.workspace.rootPath + patterns[i].replace('{FILE}', name);
                        } else {
                            fileToOpen = path.join(directory, patterns[i].replace('{FILE}', name));
                        }
                        replacements.forEach(pair => {
                            fileToOpen = fileToOpen.replace(pair.find, pair.replace);
                        });
                        if (fs.existsSync(fileToOpen)) {
                            for (let i in vscode.window.visibleTextEditors) {
                                let textEditor : vscode.TextEditor = vscode.window.visibleTextEditors[i];
                                if (textEditor.document.fileName == fileToOpen) {
                                    resolve(textEditor);
                                    return;
                                }
                            }

                            vscode.workspace.openTextDocument(fileToOpen)
                                .then((doc: vscode.TextDocument) => {
                                    vscode.window.showTextDocument(doc, 1, true)
                                        .then(function (textEditor: vscode.TextEditor) {
                                            resolve(textEditor);
                                        });
                                });
                            return;
                        }
                    }
                }

                if (notFoundBehavior === 'Create source file' && extension?.toLowerCase() !== 'cpp') {
                    let workspaceEdit = new vscode.WorkspaceEdit;
                    workspaceEdit.createFile(vscode.Uri.file(directory + '/' + name + '.cpp'), {overwrite: false, ignoreIfExists: true});
                    return vscode.workspace.applyEdit(workspaceEdit)
                        .then(function (result: boolean) {
                            if (result) {
                                return vscode.workspace.openTextDocument(directory + '/' + name + '.cpp')
                                    .then((doc: vscode.TextDocument) => {
                                        vscode.window.showTextDocument(doc, 1, true)
                                            .then(function (textEditor: vscode.TextEditor) {
                                                textEditor.insertSnippet(new vscode.SnippetString("#include \"" + name + "." + extension + "\"\n"))
                                                    .then(function () {
                                                        resolve(textEditor);
                                                    });
                                            });
                                    });
                            }
                            if (vscode.window.activeTextEditor) {
                                resolve(vscode.window.activeTextEditor);
                            }
                        });
                } else if (vscode.window.activeTextEditor) {
                    resolve(vscode.window.activeTextEditor);
                }
            }
        });
    }

    /**
     * Create recursive regex with limited depth.
     *
     * @param regex
     * @param depth
     */
    public static recursiveRegex(regex: string, depth: number = 8): string {
        let result: string = regex;
        for (let i = 0; i < depth; i++) {
            result = result.replace("?R", regex);
        }
        result = result.replace("|(?R)", "");
        return result;
    }

    /**
     * Remove default value from arguments.
     *
     * @param args
     */
    public static removeArgumentDefault(args: string): string {
        return args.replace(/([^=^,]+)(\s+=\s*[^\,^>]*)/g, '$1').replace(/([^=^,]+)(=\s*[^\,]*)/g, '$1').trim();
    }
}
