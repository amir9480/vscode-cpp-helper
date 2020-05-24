import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', function () {
	this.timeout(30000);
	vscode.window.showInformationMessage('Start all tests.');

	let rootPath = path.resolve(__dirname, '../../../');
	let testWorkspacePath = rootPath + '/src/test/suite/test-workspace';

	test('test implementation', async function () {
		let headerText = fs.readFileSync(rootPath + '/src/test/suite/files/test.h', 'utf8');
		fs.writeFileSync(testWorkspacePath + '/test.h', headerText);
		fs.writeFileSync(testWorkspacePath + '/test.cpp', '#include "test.h"\n');
		let textDocument = await vscode.workspace.openTextDocument(testWorkspacePath + '/test.h');
		await vscode.window.showTextDocument(textDocument);
		if (vscode.window.activeTextEditor === undefined) {
			throw new Error("active text editor is undefined");
		}
		vscode.window.activeTextEditor.selections = [
			new vscode.Selection(10, 7, 10, 7),
			new vscode.Selection(11, 7, 11, 7),
			new vscode.Selection(13, 12, 13, 12),
			new vscode.Selection(14, 12, 14, 12),
			new vscode.Selection(17, 12, 17, 12),
			new vscode.Selection(20, 12, 20, 12),
			new vscode.Selection(22, 12, 22, 12),
			new vscode.Selection(24, 30, 24, 30),
			new vscode.Selection(26, 12, 26, 12),
			new vscode.Selection(31, 12, 31, 12),
			new vscode.Selection(38, 12, 38, 12),
			new vscode.Selection(39, 12, 39, 12),
			new vscode.Selection(40, 12, 40, 12),
			new vscode.Selection(42, 12, 42, 12),
			new vscode.Selection(42, 12, 42, 12),
			new vscode.Selection(50, 12, 50, 12),
			new vscode.Selection(51, 12, 51, 12),
			new vscode.Selection(53, 12, 53, 12),
		];
		await vscode.commands.executeCommand('cpp-helper.create-implementation');
		await vscode.workspace.saveAll();
		await new Promise((rs, rj) => setTimeout(() => rs(true), 3000));
		vscode.window.showInformationMessage('Hello!');
	});
});
