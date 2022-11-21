"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineBasedFileCompare = void 0;
const compareSync_1 = require("./compareSync");
const compareAsync_1 = require("./compareAsync");
/**
 * Compare files line by line with options to ignore
 * line endings and white space differences.
 */
exports.lineBasedFileCompare = {
    compareSync: compareSync_1.lineBasedCompareSync,
    compareAsync: compareAsync_1.lineBasedCompareAsync
};
//# sourceMappingURL=lineBasedFileCompare.js.map