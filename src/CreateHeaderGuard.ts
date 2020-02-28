import * as vscode from 'vscode';

export default function () {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.selection) {
        let fileName = vscode.window.activeTextEditor?.document.fileName;
        let name = fileName.replace(/^.*[\\\/]/, '').replace(/\.[^\.]+$/, '');
        let headerGuard: any = vscode.workspace.getConfiguration("CppHelper").get<string>('HeaderGuardPattern');
        headerGuard = headerGuard.replace('{FILE}', name.toUpperCase());
        if (vscode.window.activeTextEditor) {
            vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString('\n#endif // ' + headerGuard), vscode.window.activeTextEditor.document.positionAt(vscode.window.activeTextEditor.document.getText().length));
            vscode.window.activeTextEditor.insertSnippet(new vscode.SnippetString('#ifndef ' + headerGuard + '\n#define ' + headerGuard + '\n\n'), vscode.window.activeTextEditor.document.positionAt(0));
        }
    }
}
