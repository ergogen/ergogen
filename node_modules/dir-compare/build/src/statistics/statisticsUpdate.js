/**
 * Calculates comparison statistics.
 */
module.exports = {
    updateStatisticsBoth(entry1, entry2, same, reason, type, permissionDeniedState, statistics, options) {
        same ? statistics.equal++ : statistics.distinct++;
        if (type === 'file') {
            same ? statistics.equalFiles++ : statistics.distinctFiles++;
        }
        else if (type === 'directory') {
            same ? statistics.equalDirs++ : statistics.distinctDirs++;
        }
        else if (type === 'broken-link') {
            statistics.brokenLinks.distinctBrokenLinks++;
        }
        else {
            throw new Error('Unexpected type ' + type);
        }
        const isSymlink1 = entry1 ? entry1.isSymlink : false;
        const isSymlink2 = entry2 ? entry2.isSymlink : false;
        const isSymlink = isSymlink1 || isSymlink2;
        if (options.compareSymlink && isSymlink) {
            const symlinks = statistics.symlinks;
            if (reason === 'different-symlink') {
                symlinks.distinctSymlinks++;
            }
            else {
                symlinks.equalSymlinks++;
            }
        }
        if (permissionDeniedState === "access-error-left") {
            statistics.permissionDenied.leftPermissionDenied++;
        }
        else if (permissionDeniedState === "access-error-right") {
            statistics.permissionDenied.rightPermissionDenied++;
        }
        else if (permissionDeniedState === "access-error-both") {
            statistics.permissionDenied.distinctPermissionDenied++;
        }
    },
    updateStatisticsLeft(entry1, type, permissionDeniedState, statistics, options) {
        statistics.left++;
        if (type === 'file') {
            statistics.leftFiles++;
        }
        else if (type === 'directory') {
            statistics.leftDirs++;
        }
        else if (type === 'broken-link') {
            statistics.brokenLinks.leftBrokenLinks++;
        }
        else {
            throw new Error('Unexpected type ' + type);
        }
        if (options.compareSymlink && entry1.isSymlink) {
            statistics.symlinks.leftSymlinks++;
        }
        if (permissionDeniedState === "access-error-left") {
            statistics.permissionDenied.leftPermissionDenied++;
        }
    },
    updateStatisticsRight(entry2, type, permissionDeniedState, statistics, options) {
        statistics.right++;
        if (type === 'file') {
            statistics.rightFiles++;
        }
        else if (type === 'directory') {
            statistics.rightDirs++;
        }
        else if (type === 'broken-link') {
            statistics.brokenLinks.rightBrokenLinks++;
        }
        else {
            throw new Error('Unexpected type ' + type);
        }
        if (options.compareSymlink && entry2.isSymlink) {
            statistics.symlinks.rightSymlinks++;
        }
        if (permissionDeniedState === "access-error-right") {
            statistics.permissionDenied.rightPermissionDenied++;
        }
    },
};
//# sourceMappingURL=statisticsUpdate.js.map