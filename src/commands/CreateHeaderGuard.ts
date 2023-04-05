import * as vscode from 'vscode';

// Create header guard command
export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        let fileName = vscode.window.activeTextEditor?.document.fileName;
        let name = fileName.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '');
        let headerGuard: any = vscode.workspace.getConfiguration("CppHelper").get<string>('HeaderGuardPattern');
        headerGuard = headerGuard.replace('{FILE}', name.toUpperCase());
        
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.insertSnippet(new vscode.SnippetString('\n#endif // ' + headerGuard), editor.document.positionAt(editor.document.getText().length))
            .then(_ => {
                editor.insertSnippet(new vscode.SnippetString('#ifndef ' + headerGuard + '\n#define ' + headerGuard + '\n\n'), editor.document.positionAt(0));
            });
        }
    }
}
