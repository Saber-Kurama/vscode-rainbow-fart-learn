// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import commands from './commands';
import share from './share';
import settings from './settings';
import assets from './assets';
import inputHook from './inputHook';
import service from './services';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-rainbow-fart-learn" is now active!');
	share.setPath(context.globalStorageUri.path);
	commands(context);
	process.nextTick(() => {
		console.log('开始完成代码');
		settings.load();
		assets.init();
		inputHook();
		service();
	})
}

// this method is called when your extension is deactivated
export function deactivate() {}
