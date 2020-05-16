import * as vscode from 'vscode';
import { create } from './CreateImplementation';

/**
 * Generate Implementation Here Command
 */
export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        if (vscode.window.activeTextEditor) {
            var activeEditor = vscode.window.activeTextEditor;
            var selections = activeEditor.selections;
            selections = selections.sort((a:vscode.Selection, b: vscode.Selection) => a.start.isAfter(b.start) ? 1 : -1);
            create(activeEditor, activeEditor.selections, activeEditor);
        }
    }
}
