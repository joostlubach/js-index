# js-index

Allows building `index.js` or `index.ts` files easily.

## Build index with ease

In any JavaScript or TypeScript file, simply invoke command "Build index" (or press `Ctrl+K, I` / `Cmd+K, I`) to create an export listing of all files in the directory.

By default, all files are exported as:

```js
export ${variable} from ${relpath};
```

E.g. having files `fileOne.js` and `fileTwo.js` in your directory yields:

```js
export fileOne from './fileOne.js'
export fileTwo from './fileTwo.js'
```

## Markers

You can use markers (`@index` and `/index`) to tell where the index should be built, instead of replacing the entire file:

```js
// This line will remain in the file.

// @index

// ... The index will be (re)placed here.  

// /index

// This line will remain in the file.
```

## Customize template

You can customize the template that is used to build the index lines by specifying these after the `@index` marker:

```js
// @index: myCustomExportFunction(${relpath})

```

Given files `fileOne.js` and `fileTwo.js`, this will yield:

```js
// @index: myCustomExportFunction(${relpath})

myCustomExportFunction('./fileOne.js')
myCustomExportFunction('./fileTwo.js')
```

The following placeholders can be used:

- `${relpath}`: the relative path, excluding extension, to the file to export (e.g. `'./fileOne'`)
- `${relpathwithext}`: the relative path, including extension, to the file to export (e.g. `'./fileOne.js'`)
- `${name}`: the file name, without extension (e.g. `'fileOne'`)
- `${variable}`: the corresponding variable name, derived from the file name but camel cased (e.g. `FileOne`)

### Search and replace

You can add a regular expression suffix to search and replace.

Given files `ParagraphBlock.js` and `CallToActionBlock.js`, this will yield:

```js
// @index: export {default as ${variable/Block$//}} from ${relpath}

export {default as Paragraph} from './ParagraphBlock'
export {default as CallToAction} from './CallToActionBlock'
```

### Modifiers

You can add some modifiers to further customize your template. Modifiers are prefixed with a colon (:) and come after an optional regular expression.

Given files `ParagraphBlock.js` and `CallToActionBlock.js`, this will yield:

```js
export default {
  // @index: ${variable/Block$//:kebab:quoted}: require(${relpath}).default,
  'call-to-action': require('./CallToActionBlock').default,
  'paragraph': require('./ParagraphBlock').default
  // /index
}
```

The following modifiers are available:

- `lower`:  `'FileOne' -> 'fileone'`
- `upper`:  `'FileOne' -> 'FILEONE'`
- `camel`:  `'FileOne' -> 'fileOne'`
- `pascal`: `'fileOne' -> 'FileOne'`
- `kebab`:  `'FileOne' -> 'file-one'`
- `snake`:  `'FileOne' -> 'file_one'`
- `dot`:    `'FileOne' -> 'file.one'`
- `title`:  `'FileOne' -> 'File One'`
- `quoted`: `File'One` -> `'File\'One'`

You can customize quotes using the `js-index.quotes` setting.

## Customize file patterns

By default, js-index will include *all files and directories*, except the file being edited.

You can customize this by specifying (RegExp) patterns between parentheses after the `@index` marker. You can specify multiple patterns separated by comma's, and they can be prefixed with `D:` to target directories only,
or `F:` to target files only.

Examples:

- `// @index(\.yml$)` will only include all `*.yml` files (and directories).
- `// @index(D: dirone|dirtwo)` will include only directories `dirone` and `dirtwo`. All files are still included.
- `// @index(D: dirone, F: \.yml$)` only includes directory `dirone` and only `*.yml` files.

### Exclusion

You can make a pattern *exclude* rather than *include* an entry by prefixing it with `!`.

Examples:

- `// @index(!\.yml$)` will exclude all `*.yml` files (and directories).
- `// @index(D: !dirone|dirtwo)` will exclude directories `dirone` and `dirtwo`. All other directories, and all files are still included.
- `// @index(D: dirone, F: !\.yml$)` only includes directory `dirone` and excludes all `*.yml` files.

When the first applicable pattern is an inclusion pattern, all other files and/or directories are excluded. Conversely, if the first applicable pattern is an exclusion pattern, all other files and/or are included.

### Custom pattern and custom template

When using both custom patterns and a custom template, use the following notation:

```js
// @index(\.yml$): exportYAML(${relpath})
```

## Indentation

You can make an index indented by indenting the start marker, e.g.

```js
module.exports = {
  // @index: ${variable}: require(${relpath})
  // /index
}
```

Will indent the index entries so that a proper object is created.

## Alignment

You can insert markers to align the entries in the index. The default marker is `"|"` but this is customizable in the configuration of this extension.

For example, the vertical bar before `require` ensures that the output is aligned:

```js
module.exports = {
  // @index: ${variable}: |require(${relpath}),
  // /index
}
```

Turns into something like:

```js
module.exports = {
  // @index: ${variable}: |require(${relpath}),
  fileOne:          require('./fileOne.js'),
  fileEleven:       require('./fileEleven.js'),
  veryLongFileName: require('./veryLongFileName.js'),
  // /index
}
```
