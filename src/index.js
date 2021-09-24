const vscode = require('vscode')
const fs = require('fs')
const templateList = require('./template/list')
const { getWebViewContent, findLine } = require('./utils')

// function resolveCompletionItem(item, token) {
// 	return null;
// }

// //需要返回一个列表.
// function provideCompletionItems(document, position, token, context) {
// 	console.log(document, position, token, context);
// 	return [
// 		new vscode.CompletionItem("123", vscode.CompletionItemKind.Property)
// 	];
// }

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	// 查看文档
	let showLyTableDoc = vscode.commands.registerCommand('LyTable.showLyTableDoc', () => {
		const panel = vscode.window.createWebviewPanel(
			'webview',
			"LyTable文档", // 视图标题
			vscode.ViewColumn.One, // 显示在编辑器的哪个部位
		)
		panel.webview.html = getWebViewContent(context, 'src/view/doc/doc.html')
	})

	// 生成lyTable代码
	let createLyTable = vscode.commands.registerCommand('LyTable.createLyTable', ({ path }) => {
		fs.writeFileSync(`${path.substr(1)}`, templateList)
	})

	// 创建lyTable文件
	let createLyTableFile = vscode.commands.registerCommand('LyTable.createLyTableFile', ({ path }) => {
		fs.writeFileSync(`${path.substr(1)}/list.vue`, templateList)
	})
	
	// 添加列插槽
	let createSlot = vscode.commands.registerCommand('LyTable.createSlot', () => {
		const editor = vscode.editor || vscode.window.activeTextEditor
		// 获取当前文件文本
		const { document, selection } = editor
		const line = findLine(document, '</ly-table>')
		// 未匹配到文本
		if(line < 0){
			vscode.window.showInformationMessage('未检测到该文件使用ly-table组件、或者使用有误')
			return false
		}
		const select = document.getText(selection); // 获取选中文本内容
		const currentLine = selection.end.line // 当前行数
		const lineEnd =  document.lineAt(selection.active).range.end.character // 行末
		const lineSpace = document.lineAt(currentLine).firstNonWhitespaceCharacterIndex // 当前行前面的缩进数
		const slotLineSpace = document.lineAt(line).firstNonWhitespaceCharacterIndex // 当前行前面的缩进数(slot)
		
		editor.edit((editBuilder) => {
			// 插入slot: ''
			editBuilder.insert(
				new vscode.Position(currentLine, lineEnd),
				`\n${''.padStart(lineSpace)}slot: '${select}'`
			)
			// 插入<template #="{ row }"></template>
			editBuilder.insert(
				new vscode.Position(line, 0),
				`${''.padStart(slotLineSpace + 2)}<template #${select}="{ row }">\n${''.padStart(slotLineSpace + 4)}\n${''.padStart(slotLineSpace + 2)}</template>\n`
			)
		})
	})
	// let lyTableSuggest = vscode.languages.registerCompletionItemProvider('javascript', {
	// 	provideCompletionItems,
	// 	resolveCompletionItem // 光标选中当前自动补全item时触发动作，一般情况下无需处理
 	// }, '.')

	context.subscriptions.push(showLyTableDoc, createLyTable, createLyTableFile, createSlot);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
