/// <reference types="node" />
import fs = require("fs");
/**
 * Returns the sorted list of entries in a directory.
 */
export function buildDirEntries(rootEntry: any, dirEntries: any, relativePath: any, options: any): {
    name: any;
    absolutePath: any;
    path: any;
    stat: fs.Stats;
    lstat: fs.Stats;
    isSymlink: boolean;
    isBrokenLink: boolean;
    isDirectory: boolean;
    isPermissionDenied: boolean;
}[];
/**
 * Returns the sorted list of entries in a directory.
 */
export function buildDirEntries(rootEntry: any, dirEntries: any, relativePath: any, options: any): {
    name: any;
    absolutePath: any;
    path: any;
    stat: fs.Stats;
    lstat: fs.Stats;
    isSymlink: boolean;
    isBrokenLink: boolean;
    isDirectory: boolean;
    isPermissionDenied: boolean;
}[];
export function buildEntry(absolutePath: any, path: any, name: any, options: any): {
    name: any;
    absolutePath: any;
    path: any;
    stat: fs.Stats;
    lstat: fs.Stats;
    isSymlink: boolean;
    isBrokenLink: boolean;
    isDirectory: boolean;
    isPermissionDenied: boolean;
};
export function buildEntry(absolutePath: any, path: any, name: any, options: any): {
    name: any;
    absolutePath: any;
    path: any;
    stat: fs.Stats;
    lstat: fs.Stats;
    isSymlink: boolean;
    isBrokenLink: boolean;
    isDirectory: boolean;
    isPermissionDenied: boolean;
};
//# sourceMappingURL=entryBuilder.d.ts.map