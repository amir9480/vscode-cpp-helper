// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	showWelcomeMessage(context);
	context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.create-implementation', require('./CreateImplementation').default));
	context.subscriptions.push(vscode.commands.registerCommand('cpp-helper.create-header-guard', require('./CreateHeaderGuard').default));
}

// this method is called when your extension is deactivated
export function deactivate() {}

function showWelcomeMessage(context: vscode.ExtensionContext) {
	let previousVersion = context.globalState.get<string>('cpp-helper-version');
	let currentVersion = vscode.extensions.getExtension('amiralizadeh9480.cpp-helper')?.packageJSON?.version;
	let message : string | null = null;
	let previousVersionArray = previousVersion ? previousVersion.split('.').map((s: string) => Number(s)) : [0, 0, 0];
	let currentVersionArray = currentVersion.split('.').map((s: string) => Number(s));
	if (previousVersion === undefined || previousVersion.length === 0) {
		message = "Thanks for using C++ Helper.";
	} else if (currentVersion !== previousVersion && (
		(previousVersionArray[0] === currentVersionArray[0] && previousVersionArray[1] === currentVersionArray[1] && previousVersionArray[2] < currentVersionArray[2]) ||
		(previousVersionArray[0] === currentVersionArray[0] && previousVersionArray[1] < currentVersionArray[1]) ||
		(previousVersionArray[0] < currentVersionArray[0])
	)
	) {
		message = "C++ Helper updated to " + currentVersion;
	}
	if (message) {
		vscode.window.showInformationMessage(message, '⭐️ Rate', '🐞 Report Bug')
			.then(function (val: string | undefined) {
				if (val === '⭐️ Rate') {
					vscode.env.openExternal(vscode.Uri.parse('https://marketplace.visualstudio.com/items?itemName=amiralizadeh9480.cpp-helper'));
				} else if (val === '🐞 Report Bug') {
					vscode.env.openExternal(vscode.Uri.parse('https://github.com/amir9480/vscode-cpp-helper/issues'));
				}
			});
		context.globalState.update('cpp-helper-version', currentVersion);
	}
}

