export function initStats(options: any): {
    distinct: number;
    equal: number;
    left: number;
    right: number;
    distinctFiles: number;
    equalFiles: number;
    leftFiles: number;
    rightFiles: number;
    distinctDirs: number;
    equalDirs: number;
    leftDirs: number;
    rightDirs: number;
    brokenLinks: {
        leftBrokenLinks: number;
        rightBrokenLinks: number;
        distinctBrokenLinks: number;
    };
    symlinks: {
        distinctSymlinks: number;
        equalSymlinks: number;
        leftSymlinks: number;
        rightSymlinks: number;
        differencesSymlinks: number;
        totalSymlinks: number;
    } | undefined;
    permissionDenied: {
        leftPermissionDenied: number;
        rightPermissionDenied: number;
        distinctPermissionDenied: number;
    };
    same: undefined;
};
export function initStats(options: any): {
    distinct: number;
    equal: number;
    left: number;
    right: number;
    distinctFiles: number;
    equalFiles: number;
    leftFiles: number;
    rightFiles: number;
    distinctDirs: number;
    equalDirs: number;
    leftDirs: number;
    rightDirs: number;
    brokenLinks: {
        leftBrokenLinks: number;
        rightBrokenLinks: number;
        distinctBrokenLinks: number;
    };
    symlinks: {
        distinctSymlinks: number;
        equalSymlinks: number;
        leftSymlinks: number;
        rightSymlinks: number;
        differencesSymlinks: number;
        totalSymlinks: number;
    } | undefined;
    permissionDenied: {
        leftPermissionDenied: number;
        rightPermissionDenied: number;
        distinctPermissionDenied: number;
    };
    same: undefined;
};
export function completeStatistics(statistics: any, options: any): void;
export function completeStatistics(statistics: any, options: any): void;
//# sourceMappingURL=statisticsLifecycle.d.ts.map