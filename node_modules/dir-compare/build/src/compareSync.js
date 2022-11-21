const fs = require('fs');
const pathUtils = require('path');
const entryBuilder = require('./entry/entryBuilder');
const entryEquality = require('./entry/entryEquality');
const stats = require('./statistics/statisticsUpdate');
const loopDetector = require('./symlink/loopDetector');
const entryComparator = require('./entry/entryComparator');
const entryType = require('./entry/entryType');
const { getPrmissionDenieStateWhenLeftMissing, getPrmissionDenieStateWhenRightMissing, getPermissionDeniedState } = require('./permissions/permissionDeniedState');
/**
 * Returns the sorted list of entries in a directory.
 */
function getEntries(rootEntry, relativePath, loopDetected, options) {
    if (!rootEntry || loopDetected) {
        return [];
    }
    if (rootEntry.isDirectory) {
        if (rootEntry.isPermissionDenied) {
            return [];
        }
        const entries = fs.readdirSync(rootEntry.absolutePath);
        return entryBuilder.buildDirEntries(rootEntry, entries, relativePath, options);
    }
    return [rootEntry];
}
/**
 * Compares two directories synchronously.
 */
function compare(rootEntry1, rootEntry2, level, relativePath, options, statistics, diffSet, symlinkCache) {
    const loopDetected1 = loopDetector.detectLoop(rootEntry1, symlinkCache.dir1);
    const loopDetected2 = loopDetector.detectLoop(rootEntry2, symlinkCache.dir2);
    loopDetector.updateSymlinkCache(symlinkCache, rootEntry1, rootEntry2, loopDetected1, loopDetected2);
    const entries1 = getEntries(rootEntry1, relativePath, loopDetected1, options);
    const entries2 = getEntries(rootEntry2, relativePath, loopDetected2, options);
    let i1 = 0, i2 = 0;
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
            let same, reason, state;
            const permissionDeniedState = getPermissionDeniedState(entry1, entry2);
            if (permissionDeniedState === "access-ok") {
                const compareEntryRes = entryEquality.isEntryEqualSync(entry1, entry2, type1, options);
                state = compareEntryRes.same ? 'equal' : 'distinct';
                same = compareEntryRes.same;
                reason = compareEntryRes.reason;
            }
            else {
                state = 'distinct';
                same = false;
                reason = "permission-denied";
            }
            options.resultBuilder(entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason, permissionDeniedState);
            stats.updateStatisticsBoth(entry1, entry2, same, reason, type1, permissionDeniedState, statistics, options);
            i1++;
            i2++;
            if (!options.skipSubdirs && type1 === 'directory') {
                compare(entry1, entry2, level + 1, pathUtils.join(relativePath, entry1.name), options, statistics, diffSet, loopDetector.cloneSymlinkCache(symlinkCache));
            }
        }
        else if (cmp < 0) {
            // Right missing
            const permissionDeniedState = getPrmissionDenieStateWhenRightMissing(entry1);
            options.resultBuilder(entry1, undefined, 'left', level, relativePath, options, statistics, diffSet, undefined, permissionDeniedState);
            stats.updateStatisticsLeft(entry1, type1, permissionDeniedState, statistics, options);
            i1++;
            if (type1 === 'directory' && !options.skipSubdirs) {
                compare(entry1, undefined, level + 1, pathUtils.join(relativePath, entry1.name), options, statistics, diffSet, loopDetector.cloneSymlinkCache(symlinkCache));
            }
        }
        else {
            // Left missing
            let permissionDeniedState = getPrmissionDenieStateWhenLeftMissing(entry2);
            options.resultBuilder(undefined, entry2, "right", level, relativePath, options, statistics, diffSet, undefined, permissionDeniedState);
            stats.updateStatisticsRight(entry2, type2, permissionDeniedState, statistics, options);
            i2++;
            if (type2 === 'directory' && !options.skipSubdirs) {
                compare(undefined, entry2, level + 1, pathUtils.join(relativePath, entry2.name), options, statistics, diffSet, loopDetector.cloneSymlinkCache(symlinkCache));
            }
        }
    }
}
module.exports = compare;
//# sourceMappingURL=compareSync.js.map