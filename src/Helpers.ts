import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');

export default class Helpers {

    /**
     * Convert template complete string to parameter names only.
     *
     * @example template<typename T1, typename T2>  --->  T1, T2
     *
     * @param template
     */
    public static templateNames(template: string) : Array<string> {
        return this.templateParameters(template).map(function (templ) {
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
        return this.spacer().repeat(count) + str.replace(/(\r\n|\r|\n)/g, '\n' + this.spacer().repeat(count)).replace(/\n\s+$/g, '\n');
    }

    /**
     * Opens source file of a active editor.
     */
    public static findSourceFile(): Promise<vscode.TextEditor> {
        let patterns: any = vscode.workspace.getConfiguration("CppHelper").get<Array<string>>('SourcePattern');
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
                        if (fs.existsSync(fileToOpen)) {
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
                resolve(vscode.window.activeTextEditor);
            }
        });
    }
}
