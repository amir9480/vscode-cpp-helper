import * as vscode from 'vscode';
import FunctionDetails from './FunctionDetails';
import NamespaceDetails from './NamespaceDetails';
import Helpers from "./Helpers";

/**
 * Generate Implementation Command
 */
export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        let code = vscode.window.activeTextEditor.document.getText();
        if (vscode.window.activeTextEditor) {
            for (let i in vscode.window.activeTextEditor?.selections) {
                let activeEditor = vscode.window.activeTextEditor;
                let selection = activeEditor.selections[i];
                let funcDetails = FunctionDetails.parsePosition(code, activeEditor.document.offsetAt(selection.start));
                if (funcDetails) { // If was null then selection is not a c++ function declration
                    Helpers.findSourceFile().then(function (doc : vscode.TextEditor) {
                        let imp = '\n' + funcDetails?.generteImplementation(true);
                        if (funcDetails && imp) {
                            let position: vscode.Position | undefined;
                            if (doc === activeEditor) { // Implementate under class it self.
                                position = vscode.window.activeTextEditor?.document.positionAt(funcDetails.class ? funcDetails.class.getRootClass().end : 0);
                            } else { // Implementate in related source file
                                let namespaces = NamespaceDetails.parseNamespaces(doc.document.getText());
                                // find functions's namespace in source file for insert position
                                for (let i in namespaces) {
                                    if (namespaces[i].fullname() === funcDetails.getNamespace()?.fullname()) {
                                        position = doc.document.positionAt(namespaces[i].end - 1);
                                        break;
                                    }
                                }
                                // Function's name space does not exists. so creating namespace first.
                                if (position === undefined) {
                                    doc.insertSnippet(new vscode.SnippetString(funcDetails.getNamespace()?.generateCode()), doc.document.positionAt(doc.document.getText().length))
                                        .then(function () {
                                            if (funcDetails && typeof imp === 'string') {
                                                let namespaces = NamespaceDetails.parseNamespaces(doc.document.getText());
                                                // Namespace created so searching for scopes again
                                                for (let i in namespaces) {
                                                    if (namespaces[i].fullname() === funcDetails.getNamespace()?.fullname()) {
                                                        position = doc.document.positionAt(namespaces[i].end - 1);
                                                        doc.insertSnippet(new vscode.SnippetString(funcDetails.getNamespace() ? Helpers.indent(imp) : imp), position ? position : doc.document.positionAt(doc.document.getText().length));
                                                        break;
                                                    }
                                                }
                                            }
                                        });
                                    if (funcDetails.getNamespace()) {
                                        return;
                                    }
                                }
                            }
                            doc.insertSnippet(new vscode.SnippetString(funcDetails.getNamespace() ? Helpers.indent(imp) : imp), position ? position : doc.document.positionAt(doc.document.getText().length));
                        }
                    });
                } else {
                    vscode.window.showInformationMessage("Function not detected.");
                }
            }
        }
    }
}
