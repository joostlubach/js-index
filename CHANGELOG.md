# Change Log

## [0.0.2]

First release

## [0.0.3]

Small fix: index files with only

```
// @index
// /index
```

are now handled correctly.

## [0.0.4]

- Added setting `js-index.defaultTemplate`.

## [0.0.5]

- Added .tsx and .jsx files by default.

## [0.1.0]

*Potentially breaking changes!*

- More powerful patterns (exclusion, multiple patterns)
- Indexes are aligned with their start marker
- Alignment markers for generated indexes
- Addition of `${variable:upper}` placeholder

## [0.2.0]

- Added modifiers
- Added search & replace

## [0.2.1]

- Less intrusive filename -> variable name derivation

## [0.2.2]

- Configurable alignment markers

## [0.3.0]

- Read index from files in other directory.

## [0.3.1]

- Fix by @eMuonTau for filenames containing dots.

## [0.3.2]

- Fix for broken index files without markers.

## [0.3.3]

- Support for escaping interpolation literals with a slash (e.g. `\${name}`).

## [0.3.4] - [0.3.5]

- Tried to bundle the extension. Didn't work, so reverted.

## [0.4]

- Allowing slashes in replacements.
- `${relpath}` now refers to the actual relative path from the index file, not hardoded `./{filename}`

> NOTE: the second change is formally not backwards-compatible. If you use the remote directory listing, e.g. `// @index[../some/other/dir]`, make sure your paths still work after upgrading. I've chosen to do this because it is more logical, and I doubt anyone is using this remote directory feature a lot.

## [0.4.2]

- Fix for relative paths in non-remote listings.

## [0.4.3]

- Added configuration setting `js-index.defaultPatterns` for specifying a default set of patterns to use when no patterns are specified in the index marker.