const entryBuilder = require('./entry/entryBuilder');
const entryEquality = require('./entry/entryEquality');
const stats = require('./statistics/statisticsUpdate');
const pathUtils = require('path');
const fsPromise = require('./fs/fsPromise');
const loopDetector = require('./symlink/loopDetector');
const entryComparator = require('./entry/entryComparator');
const entryType = require('./entry/entryType');
const { getPrmissionDenieStateWhenLeftMissing, getPrmissionDenieStateWhenRightMissing, getPermissionDeniedState } = require('./permissions/permissionDeniedState');
/**
 * Returns the sorted list of entries in a directory.
 */
function getEntries(rootEntry, relativePath, loopDetected, options) {
    if (!rootEntry || loopDetected) {
        return Promise.resolve([]);
    }
    if (rootEntry.isDirectory) {
        if (rootEntry.isPermissionDenied) {
            return [];
        }
        return fsPromise.readdir(rootEntry.absolutePath)
            .then(entries => entryBuilder.buildDirEntries(rootEntry, entries, relativePath, options));
    }
    return Promise.resolve([rootEntry]);
}
/**
 * Compares two directories asynchronously.
 */
function compare(rootEntry1, rootEntry2, level, relativePath, options, statistics, diffSet, symlinkCache) {
    const loopDetected1 = loopDetector.detectLoop(rootEntry1, symlinkCache.dir1);
    const loopDetected2 = loopDetector.detectLoop(rootEntry2, symlinkCache.dir2);
    loopDetector.updateSymlinkCache(symlinkCache, rootEntry1, rootEntry2, loopDetected1, loopDetected2);
    return Promise.all([getEntries(rootEntry1, relativePath, loopDetected1, options), getEntries(rootEntry2, relativePath, loopDetected2, options)])
        .then(entriesResult => {
        const entries1 = entriesResult[0];
        const entries2 = entriesResult[1];
        let i1 = 0, i2 = 0;
        const comparePromises = [];
        const compareFilePromises = [];
        let subDiffSet;
        while (i1 < entries1.length || i2 < entries2.length) {
            const entry1 = entries1[i1];
            const entry2 = entries2[i2];
            let type1, type2;
            // compare entry name (-1, 0, 1)
            let cmp;
            if (i1 < entries1.length && i2 < entries2.length) {
                cmp = entryComparator.compareEntry(entry1, entry2, options);
                type1 = entryType.getType(entry1);
                type2 = entryType.getType(entry2);
            }
            else if (i1 < entries1.length) {
                type1 = entryType.getType(entry1);
                type2 = entryType.getType(undefined);
                cmp = -1;
            }
            else {
                type1 = entryType.getType(undefined);
                type2 = entryType.getType(entry2);
                cmp = 1;
            }
            // process entry
            if (cmp === 0) {
                // Both left/right exist and have the same name and type
                const permissionDeniedState = getPermissionDeniedState(entry1, entry2);
                if (permissionDeniedState === "access-ok") {
                    const compareEntryRes = entryEquality.isEntryEqualAsync(entry1, entry2, type1, diffSet, options);
                    const samePromise = compareEntryRes.samePromise;
                    const same = compareEntryRes.same;
                    if (same !== undefined) {
                        options.resultBuilder(entry1, entry2, same ? 'equal' : 'distinct', level, relativePath, options, statistics, diffSet, compareEntryRes.reason, permissionDeniedState);
                        stats.updateStatisticsBoth(entry1, entry2, compareEntryRes.same, compareEntryRes.reason, type1, permissionDeniedState, statistics, options);
                    }
                    else {
                        compareFilePromises.push(samePromise);
                    }
                }
                else {
                    const state = 'distinct';
                    const reason = "permission-denied";
                    const same = false;
                    options.resultBuilder(entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason, permissionDeniedState);
                    stats.updateStatisticsBoth(entry1, entry2, same, reason, type1, permissionDeniedState, statistics, options);
                }
                i1++;
                i2++;
                if (!options.skipSubdirs && type1 === 'directory') {
                    if (!options.noDiffSet) {
                        subDiffSet = [];
                        diffSet.push(subDiffSet);
                    }
                    comparePromises.push(compare(entry1, entry2, level + 1, pathUtils.join(relativePath, entry1.name), options, statistics, subDiffSet, loopDetector.cloneSymlinkCache(symlinkCache)));
                }
            }
            else if (cmp < 0) {
                // Right missing
                const permissionDeniedState = getPrmissionDenieStateWhenRightMissing(entry1);
                options.resultBuilder(entry1, undefined, 'left', level, relativePath, options, statistics, diffSet, undefined, permissionDeniedState);
                stats.updateStatisticsLeft(entry1, type1, permissionDeniedState, statistics, options);
                i1++;
                if (type1 === 'directory' && !options.skipSubdirs) {
                    if (!options.noDiffSet) {
                        subDiffSet = [];
                        diffSet.push(subDiffSet);
                    }
                    comparePromises.push(compare(entry1, undefined, level + 1, pathUtils.join(relativePath, entry1.name), options, statistics, subDiffSet, loopDetector.cloneSymlinkCache(symlinkCache)));
                }
            }
            else {
                // Left missing
                let permissionDeniedState = getPrmissionDenieStateWhenLeftMissing(entry2);
                options.resultBuilder(undefined, entry2, 'right', level, relativePath, options, statistics, diffSet, undefined, permissionDeniedState);
                stats.updateStatisticsRight(entry2, type2, permissionDeniedState, statistics, options);
                i2++;
                if (type2 === 'directory' && !options.skipSubdirs) {
                    if (!options.noDiffSet) {
                        subDiffSet = [];
                        diffSet.push(subDiffSet);
                    }
                    comparePromises.push(compare(undefined, entry2, level + 1, pathUtils.join(relativePath, entry2.name), options, statistics, subDiffSet, loopDetector.cloneSymlinkCache(symlinkCache)));
                }
            }
        }
        return Promise.all(comparePromises)
            .then(() => Promise.all(compareFilePromises)
            .then(sameResults => {
            for (let i = 0; i < sameResults.length; i++) {
                const sameResult = sameResults[i];
                if (sameResult.error) {
                    return Promise.reject(sameResult.error);
                }
                else {
                    const permissionDeniedState = "access-ok";
                    options.resultBuilder(sameResult.entry1, sameResult.entry2, sameResult.same ? 'equal' : 'distinct', level, relativePath, options, statistics, sameResult.diffSet, sameResult.reason, permissionDeniedState);
                    stats.updateStatisticsBoth(sameResult.entries1, sameResult.entries2, sameResult.same, sameResult.reason, sameResult.type1, permissionDeniedState, statistics, options);
                }
            }
        }));
    });
}
module.exports = compare;
//# sourceMappingURL=compareAsync.js.map