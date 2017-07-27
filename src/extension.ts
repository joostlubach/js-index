'use strict';

import * as vscode from 'vscode'
import IndexManifest from './IndexManifest'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand('js-index.buildIndex', () => {
        const manifest = new IndexManifest(vscode.window.activeTextEditor.document)
        manifest.writeIndex()
    })

    context.subscriptions.push(disposable)
}