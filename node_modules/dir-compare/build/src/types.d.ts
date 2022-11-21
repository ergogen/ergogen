/// <reference types="node" />
import * as fs from "fs";
/**
 * Comparison options.
 */
export interface Options {
    /**
     * Properties to be used in various extension points ie. result builder.
     */
    [key: string]: any;
    /**
     * Compares files by size. Defaults to 'false'.
     *
     * Usually one of `compareSize` or `compareContent` options has to be activated. Otherwise files are compared by name disregarding size or content.
     */
    compareSize?: boolean;
    /**
     * Compares files by content. Defaults to 'false'.
     *
     * Usually one of `compareSize` or `compareContent` options has to be activated. Otherwise files are compared by name disregarding size or content.
     */
    compareContent?: boolean;
    /**
     * Compares files by date of modification (stat.mtime). Defaults to 'false'.
     *
     * Also see [[Options.dateTolerance]].
     */
    compareDate?: boolean;
    /**
     * Two files are considered to have the same date if the difference between their modification dates fits within date tolerance. Defaults to 1000 ms.
     */
    dateTolerance?: number;
    /**
     * Compares entries by symlink. Defaults to 'false'.

     * If this option is enabled two entries must have the same type in order to be considered equal.
     * They have to be either two fies, two directories or two symlinks.
     *
     * If left entry is a file and right entry is a symlink, they are considered distinct disregarding the content of the file.
     *
     * Further if both entries are symlinks they need to have the same link value. For example if one symlink points to '/x/b.txt' and the other to '/x/../x/b.txt' the symlinks are considered distinct even if they point to the same file.
     */
    compareSymlink?: boolean;
    /**
     * Skips sub directories. Defaults to 'false'.
     */
    skipSubdirs?: boolean;
    /**
     * Ignore empty directories. Defaults to 'false'.
     */
    skipEmptyDirs?: boolean;
    /**
     * Ignore symbolic links. Defaults to 'false'.
     */
    skipSymlinks?: boolean;
    /**
     * Ignores case when comparing names. Defaults to 'false'.
     */
    ignoreCase?: boolean;
    /**
     * Toggles presence of diffSet in output. If true, only statistics are provided. Use this when comparing large number of files to avoid out of memory situations. Defaults to 'false'.
     */
    noDiffSet?: boolean;
    /**
     * File name filter. Comma separated minimatch patterns. See [Glob patterns](https://github.com/gliviu/dir-compare#glob-patterns).
     */
    includeFilter?: string;
    /**
     * File/directory name exclude filter. Comma separated minimatch patterns. See [Glob patterns](https://github.com/gliviu/dir-compare#glob-patterns)
     */
    excludeFilter?: string;
    /**
     * Handle permission denied errors. Defaults to 'false'.
     *
     * By default when some entry cannot be read due to `EACCES` error the comparison will
     * stop immediately with an exception.
     *
     * If `handlePermissionDenied` is set to true the comparison will continue when unreadable entries are encountered.
     *
     * Offending entries will be reported within [[Difference.permissionDeniedState]], [[Difference.reason]] and [[Result.permissionDenied]].
     *
     * Lets consider we want to compare two identical folders `A` and `B` with `B/dir2` being unreadable for the current user.
     * ```
     * A                    B
     * ├── dir1             ├── dir1
     * ├──── file1          ├──── file1
     * ├── dir2             ├── dir2 (permission denied)
     * └─────file2          └─────file2
     * ```
     *
     * [[Result.diffSet]] will look like:
     *
     * |relativePath  |path1    |path2    | state      |reason                  |permissionDeniedState|
     * |--------------|---------|---------|------------|------------------------|---------------------|
     * |[/]           |dir1     |dir1     |`equal`     |                        |                     |
     * |[/dir1]       |file1    |file1    |`equal`     |                        |                     |
     * |[/]           |dir2     |dir2     |`distinct`  |  `permission-denied`   |`access-error-right` |
     * |[/dir2]       |file2    |missing  |`left`      |                        |                     |
     *
     * And [[Result.permissionDenied]] statistics look like - left: 0, right: 1, distinct: 0, total: 1
     *
     */
    handlePermissionDenied?: boolean;
    /**
     * Callback for constructing result. Called for each compared entry pair.
     *
     * Updates 'statistics' and 'diffSet'.
     *
     * See [Custom result builder](https://github.com/gliviu/dir-compare#custom-result-builder).
     */
    resultBuilder?: ResultBuilder;
    /**
     * File comparison handler. See [Custom file comparators](https://github.com/gliviu/dir-compare#custom-file-content-comparators).
     */
    compareFileSync?: CompareFileSync;
    /**
     * File comparison handler. See [Custom file comparators](https://github.com/gliviu/dir-compare#custom-file-content-comparators).
     */
    compareFileAsync?: CompareFileAsync;
    /**
     * Entry name comparison handler. See [Custom name comparators](https://github.com/gliviu/dir-compare#custom-name-comparators).
     */
    compareNameHandler?: CompareNameHandler;
}
/**
 * Callback for constructing result. Called for each compared entry pair.
 *
 * Updates 'statistics' and 'diffSet'.
 */
export declare type ResultBuilder = 
/**
 * @param entry1 Left entry.
 * @param entry2 Right entry.
 * @param state See [[DifferenceState]].
 * @param level Depth level relative to root dir.
 * @param relativePath Path relative to root dir.
 * @param statistics Statistics to be updated.
 * @param diffSet Status per each entry to be appended.
 * Do not append if [[Options.noDiffSet]] is false.
 * @param reason See [[Reason]]. Not available if entries are equal.
 */
(entry1: Entry | undefined, entry2: Entry | undefined, state: DifferenceState, level: number, relativePath: string, options: Options, statistics: Statistics, diffSet: Array<Difference> | undefined, reason: Reason | undefined) => void;
export interface Entry {
    name: string;
    absolutePath: string;
    path: string;
    stat: fs.Stats;
    lstat: fs.Stats;
    symlink: boolean;
    /**
     * True when this entry is not readable.
     * This value is set only when [[Options.handlePermissionDenied]] is enabled.
     */
    isPermissionDenied: boolean;
}
/**
 * Comparison result.
 */
export interface Result extends Statistics {
    /**
     * List of changes (present if [[Options.noDiffSet]] is false).
     */
    diffSet?: Array<Difference>;
}
export interface Statistics {
    /**
     * Any property is allowed if default result builder is not used.
     */
    [key: string]: any;
    /**
     * True if directories are identical.
     */
    same: boolean;
    /**
     * Number of distinct entries.
     */
    distinct: number;
    /**
     * Number of equal entries.
     */
    equal: number;
    /**
     * Number of entries only in path1.
     */
    left: number;
    /**
     * Number of entries only in path2.
     */
    right: number;
    /**
     * Total number of differences (distinct+left+right).
     */
    differences: number;
    /**
     * Total number of entries (differences+equal).
     */
    total: number;
    /**
     * Number of distinct files.
     */
    distinctFiles: number;
    /**
     * Number of equal files.
     */
    equalFiles: number;
    /**
     * Number of files only in path1.
     */
    leftFiles: number;
    /**
     * Number of files only in path2
     */
    rightFiles: number;
    /**
     * Total number of different files (distinctFiles+leftFiles+rightFiles).
     */
    differencesFiles: number;
    /**
     * Total number of files (differencesFiles+equalFiles).
     */
    totalFiles: number;
    /**
     * Number of distinct directories.
     */
    distinctDirs: number;
    /**
     * Number of equal directories.
     */
    equalDirs: number;
    /**
     * Number of directories only in path1.
     */
    leftDirs: number;
    /**
     * Number of directories only in path2.
     */
    rightDirs: number;
    /**
     * Total number of different directories (distinctDirs+leftDirs+rightDirs).
     */
    differencesDirs: number;
    /**
     * Total number of directories (differencesDirs+equalDirs).
     */
    totalDirs: number;
    /**
     * Stats about broken links.
     */
    brokenLinks: BrokenLinksStatistics;
    /**
     * Statistics available if 'compareSymlink' options is used.
     */
    symlinks?: SymlinkStatistics;
    /**
     * Stats about entries that could not be accessed.
     */
    permissionDenied: PermissionDeniedStatistics;
}
export interface BrokenLinksStatistics {
    /**
     * Number of broken links only in path1
     */
    leftBrokenLinks: number;
    /**
     * Number of broken links only in path2
     */
    rightBrokenLinks: number;
    /**
     * Number of broken links with same name appearing in both path1 and path2  (leftBrokenLinks + rightBrokenLinks + distinctBrokenLinks)
     */
    distinctBrokenLinks: number;
    /**
     * Total number of broken links
     */
    totalBrokenLinks: number;
}
export interface PermissionDeniedStatistics {
    /**
     * Number of forbidden entries found only in path1
     */
    leftPermissionDenied: number;
    /**
     * Number of forbidden entries found only in path2
     */
    rightPermissionDenied: number;
    /**
     * Number of forbidden entries with same name appearing in both path1 and path2  (leftPermissionDenied + rightPermissionDenied + distinctPermissionDenied)
     */
    distinctPermissionDenied: number;
    /**
     * Total number of forbidden entries
     */
    totalPermissionDenied: number;
}
export interface SymlinkStatistics {
    /**
     * Number of distinct links.
     */
    distinctSymlinks: number;
    /**
     * Number of equal links.
     */
    equalSymlinks: number;
    /**
     * Number of links only in path1.
     */
    leftSymlinks: number;
    /**
     * Number of links only in path2
     */
    rightSymlinks: number;
    /**
     * Total number of different links (distinctSymlinks+leftSymlinks+rightSymlinks).
     */
    differencesSymlinks: number;
    /**
     * Total number of links (differencesSymlinks+equalSymlinks).
     */
    totalSymlinks: number;
}
/**
 * State of left/right entries relative to each other.
 * * `equal` - Identical entries are found in both left/right dirs.
 * * `left` - Entry is found only in left dir.
 * * `right` - Entry is found only in right dir.
 * * `distinct` - Entries exist in both left/right dir but have different content. See [[Difference.reason]] to understan why entries are considered distinct.
 */
export declare type DifferenceState = "equal" | "left" | "right" | "distinct";
/**
 * Permission related state of left/right entries. Available only when [[Options.handlePermissionDenied]] is enabled.
 * * `access-ok`          - Both entries are accessible.
 * * `access-error-both`  - Neither entry can be accessed.
 * * `access-error-left`  - Left entry cannot be accessed.
 * * `access-error-right` - Right entry cannot be accessed.
 */
export declare type PermissionDeniedState = "access-ok" | "access-error-both" | "access-error-left" | "access-error-right";
/**
 * Type of entry.
 */
export declare type DifferenceType = "missing" | "file" | "directory" | "broken-link";
/**
 * Provides reason when two identically named entries are distinct.
 *
 * Not available if entries are equal.
 *
 * * `different-size` - Files differ in size.
 * * `different-date - Entry dates are different. Used when [[Options.compareDate]] is `true`.
 * * `different-content` - File contents are different. Used when [[Options.compareContent]] is `true`.
 * * `broken-link` - Both left/right entries are broken links.
 * * `different-symlink` - Symlinks are different. See [[Options.compareSymlink]] for details.
 * * `permission-denied` - One or both left/right entries are not accessible. See [[Options.handlePermissionDenied]] for details.
 */
export declare type Reason = undefined | "different-size" | "different-date" | "different-content" | "broken-link" | 'different-symlink' | 'permission-denied';
export interface Difference {
    /**
     * Any property is allowed if default result builder is not used.
     */
    [key: string]: any;
    /**
     * Path not including file/directory name; can be relative or absolute depending on call to compare().
     * Is undefined if missing on the left side.
     */
    path1?: string;
    /**
     * Path not including file/directory name; can be relative or absolute depending on call to compare().
     * Is undefined if missing on the right side.
     */
    path2?: string;
    /**
     * Path relative to root dir.
     */
    relativePath: string;
    /**
     * Left file/directory name.
     * Is undefined if missing on the left side.
     */
    name1?: string;
    /**
     * Right file/directory name.
     * Is undefined if missing on the right side.
     */
    name2?: string;
    /**
     * See [[DifferenceState]]
     */
    state: DifferenceState;
    /**
     * Permission related state of left/right entries.
     */
    permissionDeniedState: PermissionDeniedState;
    /**
     * Type of left entry.
     * Is undefined if missing on the left side.
     */
    type1: DifferenceType;
    /**
     * Type of right entry.
     * Is undefined if missing on the right side.
     */
    type2: DifferenceType;
    /**
     * Left file size.
     * Is undefined if missing on the left side.
     */
    size1?: number;
    /**
     * Right file size.
     * Is undefined if missing on the right side.
     */
    size2?: number;
    /**
     * Left entry modification date (stat.mtime).
     * Is undefined if missing on the left side.
     */
    date1?: number;
    /**
     * Right entry modification date (stat.mtime).
     * Is undefined if missing on the right side.
     */
    date2?: number;
    /**
     * Depth level relative to root dir.
     */
    level: number;
    /**
     * Provides reason when two identically named entries are distinct.
     */
    reason: Reason;
}
/**
 * Synchronous file content comparison handler.
 */
export declare type CompareFileSync = (path1: string, stat1: fs.Stats, path2: string, stat2: fs.Stats, options: Options) => boolean;
/**
 * Asynchronous file content comparison handler.
 */
export declare type CompareFileAsync = (path1: string, stat1: fs.Stats, path2: string, stat2: fs.Stats, options: Options) => Promise<boolean>;
export interface CompareFileHandler {
    compareSync: CompareFileSync;
    compareAsync: CompareFileAsync;
}
/**
 * Compares the names of two entries.
 * The comparison should be dependent on received options (ie. case sensitive, ...).
 * Returns 0 if names are identical, -1 if name1<name2, 1 if name1>name2.
 */
export declare type CompareNameHandler = (name1: string, name2: string, options: Options) => 0 | 1 | -1;
//# sourceMappingURL=types.d.ts.map