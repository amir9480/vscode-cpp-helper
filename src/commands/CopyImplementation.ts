import * as vscode from 'vscode';
import Container from '../Container';

/**
 * Copy to clipboard implementation command
 */
export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        if (vscode.window.activeTextEditor) {
            var activeEditor = vscode.window.activeTextEditor;
            var selections = activeEditor.selections;
            let imp = "";
            let selection : any;
            while (selection = selections.shift()) {
                let code = activeEditor.document.getText();
                let container = new Container(code);
                let funcDetails = container.findFunction(activeEditor.document.offsetAt(selection.start));

                if (funcDetails) { // If was null then selection is not a c++ function declration
                    imp += '\n' + funcDetails?.generteImplementation(false) + '\n';
                }
            }

            if (imp.length > 0) {
                vscode.env.clipboard.writeText(imp);
            }
        }
    }
}
