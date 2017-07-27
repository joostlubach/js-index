import * as vscode from 'vscode'
import * as Path from 'path'
import * as FS from 'fs'

type Patterns = {
	directory: RegExp,
	file:      RegExp
}
type MarkerInfo = {start: number, end: number, patterns: Patterns, template: string}

const defaultPatterns = (document: vscode.TextDocument) => ({
	directory: /^.*$/,
	file:      /\.ts$/.test(document.fileName) ? /\.ts$/ : /\.js$/
})

const defaultTemplate = 'export {default as ${variable}} from ${relpath}'

export default class IndexManifest {

	constructor(private document: vscode.TextDocument) {}

	buildIndex(patterns: Patterns, template: string) {
		const dir = Path.dirname(this.document.uri.fsPath)
		const names = this.getFilenames(patterns)

		return names.map(name => {
			const nameWithoutExtension = name.replace(/\..*?$/, '')

			return template
				.replace(/\$\{relpath\}/g, `'./${nameWithoutExtension}'`)
				.replace(/\$\{relpathwithext\}/g, `'./${name}'`)
				.replace(/\$\{variable\}/g, camelCase(nameWithoutExtension))
				.replace(/\$\{name\}/g, `'${camelCase(nameWithoutExtension)}'`) // TODO: Escape apostrophes, but who uses apostrophes in filenames anyway?
		}).join('\n')
	}

	writeIndex() {
		const {start, end, patterns, template} = this.readMarkers()
		const index = this.buildIndex(patterns, template)

		const startPosition = this.document.positionAt(start)
		const endPosition   = this.document.positionAt(end)
		const range         = new vscode.Range(startPosition, endPosition)
		
		vscode.window.activeTextEditor.edit(builder => {
			builder.replace(range, index)
		})
	}

	readMarkers(): MarkerInfo {
		const text = this.document.getText()

		const startMatch = text.match(/@index\s*(?:\((.*?)\))?\s*(?::\s*(.*?))?[\s\n]*(?:\n|$)/)
		const endMatch   = text.match(/[\s\n]*\n[\/\*\s]*\/index/)

		if (startMatch == null) {
			// Return the entire file.
			return {
				start:    0,
				end:      text.length,
				patterns: defaultPatterns(this.document),
				template: defaultTemplate
			}
		}

		// Use start and end markers (@index ... /index) and optionally parse options from the start marker.
		const start = startMatch.index + startMatch[0].length
		const end   = endMatch == null ? text.length : endMatch.index

		const patterns = this.parsePatterns(startMatch[1])
		const template = startMatch[2] || defaultTemplate

		return {start, end, patterns, template}
	}

	parsePatterns(text: string): Patterns {
		const patterns = defaultPatterns(this.document)
		if (text == null) { return patterns }

		const toRegExp = pattern => {
			pattern = pattern.trim()
			if (pattern.length === 0) { return null }

			try {
				return new RegExp(pattern)
			} catch (error) {
				vscode.window.showErrorMessage(`Invalid pattern: ${pattern}`)
				return null
			}
		}

		for (const item of text.split(',')) {
			if (/^d:/i.test(item)) {
				patterns.directory = toRegExp(item.slice(2))
			} else {
				patterns.file = toRegExp(item)
			}
		}

		return patterns
	}

	getFilenames(patterns: Patterns): string[] {
		const dir = Path.dirname(this.document.uri.fsPath)
		const names = FS.readdirSync(dir)

		const filteredNames = []

		for (const name of names) {
			const path = Path.join(dir, name)
			if (this.shouldInclude(name, path, patterns)) {
				filteredNames.push(name)
			}
		}

		return filteredNames
	}

	shouldInclude(name: string, path: string, patterns: Patterns): boolean {
		if (name === 'index.js' || name === 'index.ts') { return false }

		const stat = FS.statSync(path)
		const pattern = stat.isDirectory() ? patterns.directory : patterns.file
		if (pattern == null) { return false }

		return pattern.test(name)
	}

}

function camelCase(text: string): string {
	return text.replace(/\W+(\w)/g, (_, first) => first.toUpperCase())
}