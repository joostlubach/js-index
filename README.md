# js-index

Allows building `index.js` or `index.ts` files easily.

## Build index with ease

In any JavaScript or TypeScript file, simply invoke command "Build index" (or press `Ctrl+K, I` / `Cmd+K, I`) to create an export listing of all files in the directory.

By default, all files are exported as:

```
export ${variable} from ${relpath}
```

E.g. having files `fileOne.js` and `fileTwo.js` in your directory yields:

```
export fileOne from './fileOne.js'
export fileTwo from './fileTwo.js'
```

## Markers

You can use markers (`@index` and `/index`) to tell where the index should be built, instead of replacing the entire file:

```
// This line will remain in the file.

// @index

// ... The index will be (re)placed here.  

// /index

// This line will remain in the file.
```

## Customize template

You can customize the template that is used to build the index lines by specifying these after the `@index` marker:

```
// @index: myCustomExportFunction(${relpath})

```

Given files `fileOne.js` and `fileTwo.js`, this will yield:

```
// @index: myCustomExportFunction(${relpath})

myCustomExportFunction('./fileOne.js')
myCustomExportFunction('./fileTwo.js')
```

The following placeholders can be used:

- `${relpath}`: the relative path, excluding extension, to the file to export (e.g. `'./fileOne'`)
- `${relpathwithext}`: the relative path, including extension, to the file to export (e.g. `'./fileOne.js'`)
- `${name}`: the file name, without extension (e.g. `'fileOne'`)
- `${variable}`: the file name, without extension, and without quotes (e.g. `fileOne`)

## Customize file patterns

By default, js-index will look for all `*.js` files (or `*.ts` in the case of an `index.ts` file). All directories will also be included.

You can customize this by specifying (RegExp) patterns for files or directories (by prefixing `D:`)

Examples:

- `// @index(\.yml$)` will include all `*.yml` files. All directories are still included.
- `// @index(D:dirone|dirtwo)` will include only directories `dirone` and `dirtwo`. All `*.js` / `*.ts` files are still included.
- `// @index(D:,\.yml$)` includes no directories (empty pattern), and all `*.yml` files.

When using both custom patterns and a custom template, use the following notation:

```
// @index(\.yml$): exportYAML(${relpath})
```

**Note**: `index.js` and `index.ts` are *never* included.