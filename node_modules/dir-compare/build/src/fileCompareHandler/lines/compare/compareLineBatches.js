"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareLineBatches = void 0;
const compareLines_1 = require("./compareLines");
/**
 * Compares two batches of lines.
 *
 * @param lineBatch1 Batch to compare.
 * @param lineBatch2 Batch to compare.
 * @param context Comparison context.
 * @param options Comparison options.
 */
function compareLineBatches(lineBatch1, lineBatch2, options) {
    const compareResult = compareLines_1.compareLines(lineBatch1.lines, lineBatch2.lines, options);
    if (!compareResult.isEqual) {
        return { batchIsEqual: false, reachedEof: false, restLines: emptyRestLines() };
    }
    const reachedEof = lineBatch1.reachedEof && lineBatch2.reachedEof;
    const hasMoreLinesToProcess = compareResult.restLines1.length > 0 || compareResult.restLines2.length > 0;
    if (reachedEof && hasMoreLinesToProcess) {
        return { batchIsEqual: false, reachedEof: true, restLines: emptyRestLines() };
    }
    if (reachedEof) {
        return { batchIsEqual: true, reachedEof: true, restLines: emptyRestLines() };
    }
    return { batchIsEqual: true, reachedEof: false,
        restLines: {
            restLines1: compareResult.restLines1,
            restLines2: compareResult.restLines2,
        }
    };
}
exports.compareLineBatches = compareLineBatches;
function emptyRestLines() {
    return {
        restLines1: [],
        restLines2: []
    };
}
//# sourceMappingURL=compareLineBatches.js.map