import * as vscode from 'vscode';
import FunctionDetails from '../FunctionDetails';
import NamespaceDetails from '../NamespaceDetails';
import Helpers from "../Helpers";

function create(activeEditor: vscode.TextEditor, selections: vscode.Selection[], sourceEditor: vscode.TextEditor) {
    let selection = selections.shift();
    if (selection) {
        let code = activeEditor.document.getText();
        let funcDetails = FunctionDetails.parsePosition(code, activeEditor.document.offsetAt(selection.start), true);
        if (funcDetails) { // If was null then selection is not a c++ function declration
            let imp = '\n' + funcDetails?.generteImplementation(true);
            if (funcDetails && imp) {
                let position: vscode.Position | undefined;
                if (sourceEditor === activeEditor) { // Implementate under class it self.
                    position = vscode.window.activeTextEditor?.document.positionAt(funcDetails.class ? funcDetails.class.getRootClass().end : 0);
                } else { // Implementate in related source file
                    let namespaces = NamespaceDetails.parseNamespaces(sourceEditor.document.getText());
                    // find functions's namespace in source file for insert position
                    for (let i in namespaces) {
                        if (namespaces[i].fullname() === funcDetails.getNamespace()?.fullname()) {
                            position = sourceEditor.document.positionAt(namespaces[i].contentStart);
                            break;
                        }
                    }
                    // Function's name space does not exists. so creating namespace first.
                    if (position === undefined && funcDetails.getNamespace()) {
                        sourceEditor.insertSnippet(new vscode.SnippetString(funcDetails.getNamespace()?.generateCode()), sourceEditor.document.positionAt(sourceEditor.document.getText().length))
                            .then(function () {
                                if (funcDetails && typeof imp === 'string') {
                                    let namespaces = NamespaceDetails.parseNamespaces(sourceEditor.document.getText());
                                    // Namespace created so searching for scopes again
                                    for (let i in namespaces) {
                                        if (namespaces[i].fullname() === funcDetails.getNamespace()?.fullname()) {
                                            position = sourceEditor.document.positionAt(namespaces[i].contentStart);
                                            imp = imp.replace(/[\r\n]+$/g, '');
                                            sourceEditor.insertSnippet(new vscode.SnippetString(funcDetails.getNamespace() ? Helpers.indent(imp) : imp), position ? position : sourceEditor.document.positionAt(sourceEditor.document.getText().length))
                                                .then(function () {
                                                    if (selections.length > 0) {
                                                        create(activeEditor, selections, sourceEditor);
                                                    }
                                                });
                                            break;
                                        }
                                    }
                                }
                            });
                        return;
                    }
                }
                if (funcDetails.previouses.length > 0) {
                    let index = -1;
                    for (let i in funcDetails.previouses) {
                        let previous = funcDetails.previouses[i];
                        let ImplementationRegex = (previous.class? previous.class.name + '\\s*(<[^>]*>)?\\s*::\\s*' : '') + previous.name + '\\([^\\)]*\\)[^{]*\\{';
                        let source = sourceEditor.document.getText();
                        let regex = new RegExp(ImplementationRegex, 'gm');
                        let match = null, match2;
                        while (match = regex.exec(source)) {
                            let regex2 = new RegExp(Helpers.scopeRegex, 'gm');
                            if ((match2 = regex2.exec(source.substr(match.index + match[0].length - 1)))) {
                                index = match.index + match[0].length + match2[0].length;
                            }
                        }
                    }
                    if (index !== -1) {
                        position = sourceEditor.document.positionAt(index);
                        imp = '\n' + imp;
                    } else  if (funcDetails.getNamespace() !== null) {
                        imp = Helpers.indent(imp);
                    }
                    if (index === -1) {
                        imp = imp + '\n';
                    }
                } else  if (funcDetails.getNamespace() !== null) {
                    imp = Helpers.indent(imp);
                }
                if (funcDetails.previouses.length === 0) {
                    imp = imp + '\n';
                }
                sourceEditor.insertSnippet(new vscode.SnippetString(imp), position ? position : sourceEditor.document.positionAt(sourceEditor.document.getText().length))
                    .then(function () {
                        if (selections.length > 0) {
                            create(activeEditor, selections, sourceEditor);
                        }
                    });
            }
        } else {
            vscode.window.showInformationMessage("Function not detected.");
            if (selections.length > 0) {
                create(activeEditor, selections, sourceEditor);
            }
        }
    }
}

/**
 * Generate Implementation Command
 */
export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        if (vscode.window.activeTextEditor) {
            var activeEditor = vscode.window.activeTextEditor;
            var selections = activeEditor.selections;
            selections = selections.sort((a:vscode.Selection, b: vscode.Selection) => a.start.isAfter(b.start) ? 1 : -1);
            Helpers.openSourceFile().then(function (doc : vscode.TextEditor) {
                create(activeEditor, activeEditor.selections, doc);
            });
        }
    }
}
