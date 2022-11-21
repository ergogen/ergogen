"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileCompareHandlers = exports.compare = exports.compareSync = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const compareSync_1 = __importDefault(require("./compareSync"));
const compareAsync_1 = __importDefault(require("./compareAsync"));
const defaultResultBuilderCallback_1 = __importDefault(require("./resultBuilder/defaultResultBuilderCallback"));
const defaultFileCompare_1 = require("./fileCompareHandler/default/defaultFileCompare");
const lineBasedFileCompare_1 = require("./fileCompareHandler/lines/lineBasedFileCompare");
const defaultNameCompare_1 = __importDefault(require("./nameCompare/defaultNameCompare"));
const entryBuilder_1 = __importDefault(require("./entry/entryBuilder"));
const statisticsLifecycle_1 = __importDefault(require("./statistics/statisticsLifecycle"));
const loopDetector_1 = __importDefault(require("./symlink/loopDetector"));
const ROOT_PATH = path_1.default.sep;
__exportStar(require("./types"), exports);
/**
 * Synchronously compares given paths.
 * @param path1 Left file or directory to be compared.
 * @param path2 Right file or directory to be compared.
 * @param options Comparison options.
 */
function compareSync(path1, path2, options) {
    // realpathSync() is necessary for loop detection to work properly
    const absolutePath1 = path_1.default.normalize(path_1.default.resolve(fs_1.default.realpathSync(path1)));
    const absolutePath2 = path_1.default.normalize(path_1.default.resolve(fs_1.default.realpathSync(path2)));
    let diffSet;
    options = prepareOptions(options);
    if (!options.noDiffSet) {
        diffSet = [];
    }
    const statistics = statisticsLifecycle_1.default.initStats(options);
    compareSync_1.default(entryBuilder_1.default.buildEntry(absolutePath1, path1, path_1.default.basename(absolutePath1), options), entryBuilder_1.default.buildEntry(absolutePath2, path2, path_1.default.basename(absolutePath2), options), 0, ROOT_PATH, options, statistics, diffSet, loopDetector_1.default.initSymlinkCache());
    statisticsLifecycle_1.default.completeStatistics(statistics, options);
    statistics.diffSet = diffSet;
    return statistics;
}
exports.compareSync = compareSync;
/**
 * Asynchronously compares given paths.
 * @param path1 Left file or directory to be compared.
 * @param path2 Right file or directory to be compared.
 * @param options Comparison options.
 */
function compare(path1, path2, options) {
    let absolutePath1, absolutePath2;
    return Promise.resolve()
        .then(() => Promise.all([wrapper.realPath(path1), wrapper.realPath(path2)]))
        .then(realPaths => {
        const realPath1 = realPaths[0];
        const realPath2 = realPaths[1];
        // realpath() is necessary for loop detection to work properly
        absolutePath1 = path_1.default.normalize(path_1.default.resolve(realPath1));
        absolutePath2 = path_1.default.normalize(path_1.default.resolve(realPath2));
    })
        .then(() => {
        options = prepareOptions(options);
        let asyncDiffSet;
        if (!options.noDiffSet) {
            asyncDiffSet = [];
        }
        const statistics = statisticsLifecycle_1.default.initStats(options);
        return compareAsync_1.default(entryBuilder_1.default.buildEntry(absolutePath1, path1, path_1.default.basename(path1), options), entryBuilder_1.default.buildEntry(absolutePath2, path2, path_1.default.basename(path2), options), 0, ROOT_PATH, options, statistics, asyncDiffSet, loopDetector_1.default.initSymlinkCache())
            .then(() => {
            statisticsLifecycle_1.default.completeStatistics(statistics, options);
            if (!(options === null || options === void 0 ? void 0 : options.noDiffSet)) {
                const diffSet = [];
                rebuildAsyncDiffSet(statistics, asyncDiffSet, diffSet);
                statistics.diffSet = diffSet;
            }
            return statistics;
        });
    });
}
exports.compare = compare;
/**
 * File comparison handlers.
 * These handlers are used when [[Options.compareContent]] is set.
 */
exports.fileCompareHandlers = {
    defaultFileCompare: defaultFileCompare_1.defaultFileCompare,
    lineBasedFileCompare: lineBasedFileCompare_1.lineBasedFileCompare
};
const wrapper = {
    realPath(path, options) {
        return new Promise((resolve, reject) => {
            fs_1.default.realpath(path, options, (err, resolvedPath) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(resolvedPath);
                }
            });
        });
    }
};
function prepareOptions(options) {
    options = options || {};
    const clone = JSON.parse(JSON.stringify(options));
    clone.resultBuilder = options.resultBuilder;
    clone.compareFileSync = options.compareFileSync;
    clone.compareFileAsync = options.compareFileAsync;
    clone.compareNameHandler = options.compareNameHandler;
    if (!clone.resultBuilder) {
        clone.resultBuilder = defaultResultBuilderCallback_1.default;
    }
    if (!clone.compareFileSync) {
        clone.compareFileSync = defaultFileCompare_1.defaultFileCompare.compareSync;
    }
    if (!clone.compareFileAsync) {
        clone.compareFileAsync = defaultFileCompare_1.defaultFileCompare.compareAsync;
    }
    if (!clone.compareNameHandler) {
        clone.compareNameHandler = defaultNameCompare_1.default;
    }
    clone.dateTolerance = clone.dateTolerance || 1000;
    clone.dateTolerance = Number(clone.dateTolerance);
    if (isNaN(clone.dateTolerance)) {
        throw new Error('Date tolerance is not a number');
    }
    return clone;
}
// Async diffsets are kept into recursive structures.
// This method transforms them into one dimensional arrays.
function rebuildAsyncDiffSet(statistics, asyncDiffSet, diffSet) {
    asyncDiffSet.forEach(rawDiff => {
        if (!Array.isArray(rawDiff)) {
            diffSet.push(rawDiff);
        }
        else {
            rebuildAsyncDiffSet(statistics, rawDiff, diffSet);
        }
    });
}
//# sourceMappingURL=index.js.map