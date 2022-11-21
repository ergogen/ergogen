dir-compare
==========
Node JS directory compare

**!! Important !!** Starting with v3.0.0 the CLI utility has been moved to [dir-compare-cli](https://www.npmjs.com/package/dir-compare-cli). 

[![Build status](https://ci.appveyor.com/api/projects/status/fpnqkr2gfg7pwkxk/branch/master?svg=true)](https://ci.appveyor.com/project/gliviu/dir-compare)
[![codecov.io](http://codecov.io/github/gliviu/dir-compare/coverage.svg?branch=master)](http://codecov.io/github/gliviu/dir-compare?branch=master)

- [Installation](#installation)
- [Library](#library)
  * [Use](#use)
  * [Api](#api)
  * [Glob patterns](#glob-patterns)
  * [Custom file content comparators](#custom-file-content-comparators)
    + [Ignore line endings and white spaces](#ignore-line-endings-and-white-spaces)
  * [Custom name comparators](#custom-name-comparators)
  * [Custom result builder](#custom-result-builder)
  * [Symbolic links](#symbolic-links)
  * [Handling permission denied errors](#handling-permission-denied-errors)
- [UI tools](#ui-tools)
- [Changelog](#changelog)

# Installation
```bash
npm install dir-compare
```

# Library

## Use
```javascript
const dircompare = require('dir-compare');

const options = { compareSize: true };
// Multiple compare strategy can be used simultaneously - compareSize, compareContent, compareDate, compareSymlink.
// If one comparison fails for a pair of files, they are considered distinct.
const path1 = '...';
const path2 = '...';

// Synchronous
const res = dircompare.compareSync(path1, path2, options)
print(res)

// Asynchronous
dircompare.compare(path1, path2, options)
  .then(res => print(res))
  .catch(error => console.error(error));


function print(result) {
  console.log('Directories are %s', result.same ? 'identical' : 'different')

  console.log('Statistics - equal entries: %s, distinct entries: %s, left only entries: %s, right only entries: %s, differences: %s',
    result.equal, result.distinct, result.left, result.right, result.differences)

  result.diffSet.forEach(dif => console.log('Difference - name1: %s, type1: %s, name2: %s, type2: %s, state: %s',
    dif.name1, dif.type1, dif.name2, dif.type2, dif.state))
}
```

Typescript
```typescript
import { compare, compareSync, Options, Result } from "dir-compare";
const path1 = '...';
const path2 = '...';
const options: Options = { compareSize: true };

const res: Result = compareSync(path1, path2, options);
console.log(res)

compare(path1, path2, options)
  .then(res => console.log(res))
  .catch(error => console.error(error));
```

## Api

```typescript
compare(path1: string, path2: string, options?: Options): Promise<Result>
compareSync(path1: string, path2: string, options?: Options): Result
```
More details can be found in the reference documentation:
* [compare](https://gliviu.github.io/dc-api/index.html#compare)
* [compareSync](https://gliviu.github.io/dc-api/index.html#comparesync)
* [Options](https://gliviu.github.io/dc-api/interfaces/options.html) 
* [Result](https://gliviu.github.io/dc-api/interfaces/result.html)

Common options:
* [compareSize](https://gliviu.github.io/dc-api/interfaces/options.html#comparesize)
* [compareContent](https://gliviu.github.io/dc-api/interfaces/options.html#comparecontent)
* [compareDate](https://gliviu.github.io/dc-api/interfaces/options.html#comparedate) 
* [excludeFilter](https://gliviu.github.io/dc-api/interfaces/options.html#excludefilter)
* [includeFilter](https://gliviu.github.io/dc-api/interfaces/options.html#includefilter) 
* [ignoreCase](https://gliviu.github.io/dc-api/interfaces/options.html#ignorecase) 
* [skipSubdirs](https://gliviu.github.io/dc-api/interfaces/options.html#skipsubdirs)
* [skipEmptyDirs](https://gliviu.github.io/dc-api/interfaces/options.html#skipemptydirs)

##  Glob patterns
[Minimatch](https://www.npmjs.com/package/minimatch) patterns are used to include/exclude files to be compared.

The pattern is matched against the relative path of the entry being compared.

Following examples assume we are comparing two [dir-compare](https://github.com/gliviu/dir-compare) code bases.


```javascript
const options = { 
  excludeFilter: ".git,node_modules",   //  exclude git and node modules directories  
  excludeFilter: "expected"         ,   //  exclude '/tests/expected' directory  
  excludeFilter: "/tests/expected"  ,   //  exclude '/tests/expected' directory  
  excludeFilter: "**/expected"      ,   //  exclude '/tests/expected' directory  
  excludeFilter: "**/tests/**/*.js" ,   //  exclude all js files in '/tests' directory and subdirectories  

  includeFilter: "*.js,*.yml"       ,   //  include js and yaml files  
  includeFilter: "/tests/**/*.js"   ,   //  include all js files in '/tests' directory and subdirectories  
  includeFilter: "**/tests/**/*.ts"     //  include all js files in '/tests' directory and subdirectories  
}
```

## Custom file content comparators
By default file content is binary compared. As of version 1.5.0 custom file comparison handlers may be specified.

Custom handlers are specified by `compareFileSync` and `compareFileAsync` options which correspond to `dircompare.compareSync()` or `dircompare.compare()` methods.

A couple of handlers are included in the library:
* binary sync compare - `dircompare.fileCompareHandlers.defaultFileCompare.compareSync`
* binary async compare - `dircompare.fileCompareHandlers.defaultFileCompare.compareAsync`
* text sync compare - `dircompare.fileCompareHandlers.lineBasedFileCompare.compareSync`
* text async compare - `dircompare.fileCompareHandlers.lineBasedFileCompare.compareAsync`

Use [defaultFileCompare.js](https://github.com/gliviu/dir-compare/blob/master/src/fileCompareHandler/defaultFileCompare.js) as an example to create your own.

### Ignore line endings and white spaces
Line based comparator can be used to ignore line ending and white space differences.
```javascript
const dircompare = require('dir-compare');

const options = {
  compareContent: true,
  compareFileSync: dircompare.fileCompareHandlers.lineBasedFileCompare.compareSync,
  compareFileAsync: dircompare.fileCompareHandlers.lineBasedFileCompare.compareAsync,
  ignoreLineEnding: true,      // Ignore crlf/lf line ending differences
  ignoreWhiteSpaces: true,     // Ignore white spaces at the beginning and ending of a line (similar to 'diff -b')
  ignoreAllWhiteSpaces: true,  // Ignore all white space differences (similar to 'diff -w')
  ignoreEmptyLines: true       // Ignores differences caused by empty lines (similar to 'diff -B')
};

const path1 = '...';
const path2 = '...';
const res = dircompare.compareSync(path1, path2, options);
console.log(res)

dircompare.compare(path1, path2, options)
.then(res => console.log(res))
```
## Custom name comparators
If [default](https://github.com/gliviu/dir-compare/blob/master/src/nameCompare/defaultNameCompare.js) name comparison is not enough, custom behavior can be specified with [compareNameHandler](https://gliviu.github.io/dc-api/index.html#comparenamehandler) option.
Following example adds the possibility to ignore file extensions.
```typescript
import { Options, compare } from 'dir-compare'
import path from 'path'

const options: Options = {
    compareSize: false,                    // compare only name by disabling size and content criteria
    compareContent: false,
    compareNameHandler: customNameCompare, // new name comparator used to ignore extensions
    ignoreExtension: true,                 // supported by the custom name compare below
};

function customNameCompare(name1: string, name2: string, options: Options) {
    if (options.ignoreCase) {
        name1 = name1.toLowerCase()
        name2 = name2.toLowerCase()
    }
    if (options.ignoreExtension) {
        name1 = path.basename(name1, path.extname(name1))
        name2 = path.basename(name2, path.extname(name2))
    }
    return ((name1 === name2) ? 0 : ((name1 > name2) ? 1 : -1))
}

const path1 = '/tmp/a';
const path2 = '/tmp/b';

const res = compare(path1, path2, options).then(res => {
    console.log(`Same: ${res.same}`)
    if (!res.diffSet) {
        return
    }
    res.diffSet.forEach(dif => console.log(`${dif.name1} ${dif.name2} ${dif.state}`))
})

// Outputs
// icon.svg icon.png equal
// logo.svg logo.jpg equal
```

## Custom result builder
[Result builder](https://gliviu.github.io/dc-api/index.html#resultbuilder) is called for each pair of entries encountered during comparison. Its purpose is to append entries in `diffSet` and eventually update `statistics` object with new stats.

If needed it can be replaced with custom implementation.

```javascript
const dircompare = require("dircompare")

const customResultBuilder = function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason) {
    ...
}

const options = {
    compareSize: true,
    resultBuilder: customResultBuilder
}
const res = dircompare.compareSync('...', '...', options)

```

The [default](https://github.com/gliviu/dir-compare/blob/master/src/resultBuilder/defaultResultBuilderCallback.js) builder can be used as an example.

## Symbolic links
Unless `compareSymlink` option is used, symbolic links are resolved and any comparison is applied to the file/directory they point to.

Circular loops are handled by breaking the loop as soon as it is detected.

Version `1.x` treats broken links as `ENOENT: no such file or directory`.  
Since `2.0` they are treated as a special type of entry - `broken-link` - and are available as stats (`totalBrokenLinks`, `distinctBrokenLinks`, ...).

Using `compareSymlink` option causes `dircompare` to check symlink values for equality.
In this mode two entries with identical name are considered different if
* one is symlink, the other is not
* both are symlinks but point to different locations

These rules are applied in addition to the other comparison modes; ie. by content, by size...

If entries are different because of symlinks, `reason` will be `different-symlink`. Also statistics summarizes differences caused by symbolik links.

## Handling permission denied errors
Unreadable files or directories are normally reported as errors. The comparison will be intrerrupted with an `EACCES` exception.
This behavior can be altered with [Options.handlePermissionDenied](https://gliviu.github.io/dc-api/interfaces/options.html#handlepermissiondenied).

# UI tools
* [dir-compare-cli](https://github.com/gliviu/dir-compare-cli)
* [Visual Studio Code - Compare Folders](https://marketplace.visualstudio.com/items?itemName=moshfeu.compare-folders)

# Changelog
* v3.3.0 Added `skipEmptyDirs` option
* v3.2.0 [Handle permission denied errors](#handling-permission-denied-errors)
* v3.1.0 Added `ignoreAllWhiteSpaces` and `ignoreEmptyLines` options
* v3.0.0 Moved CLI component into separate project [dir-compare-cli](https://github.com/gliviu/dir-compare-cli)
* v2.4.0 New option to customize file/folder name comparison
* v2.3.0 Fixes
* v2.1.0 Removed [bluebird](https://github.com/petkaantonov/bluebird/#note) dependency
* v2.0.0
  * New option to compare symlinks.
  * New field indicating reason for two entries being distinct.
  * Improved command line output format.
  * Tests are no longer part of published package.
  * Generated [Api](#api) documentation.
  
  Breaking changes:
  * Broken links are no longer treated as errors. As a result there are new statistics (leftBrokenLinks, rightBrokenLinks, distinctBrokenLinks, totalBrokenLinks) and new entry type - broken-link.
    Details in [Symbolic links](#symbolic-links).
  * Typescript correction: new interface `Result` replaced `Statistics`.
* v1.8.0 
    * globstar patterns
    * typescript corrections
    * removed support for node 0.11, 0.12, iojs
* v1.7.0 performance improvements
* v1.6.0 typescript support
* v1.5.0 added option to ignore line endings and white space differences
* v1.3.0 added date tolerance option
* v1.2.0 added compare by date option
* v1.1.0
    * detect symlink loops
    * improved color scheme for command line utility
* v1.0.0
    * asynchronous processing
    * new library options: noDiffSet, resultBuilder
    * new statistics: distinctFiles, equalFiles, leftFiles, rightFiles, distinctDirs, equalDirs, leftDirs, rightDirs
    * new --async command line option
    * Fix for https://github.com/tj/commander.js/issues/125
* v0.0.3 Fix fille ordering issue for newer node versions

