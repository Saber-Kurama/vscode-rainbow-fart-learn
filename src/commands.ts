import * as vscode from 'vscode';

export default (context: vscode.ExtensionContext) => {
	let disposable = vscode.commands.registerCommand('rainbow-fart-learn.enable', () => {
		// The code you place here will be executed every time your command is executed
        console.log('执行命令------')
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello parligerly from vscode-rainbow-fart-learn!');
	});

	context.subscriptions.push(disposable);
}