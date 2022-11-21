"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineBasedCompareSync = void 0;
const fs_1 = __importDefault(require("fs"));
const closeFile_1 = __importDefault(require("../../fs/closeFile"));
const LineBasedCompareContext_1 = require("./LineBasedCompareContext");
const compareLineBatches_1 = require("./compare/compareLineBatches");
const readBufferedLines_1 = require("./lineReader/readBufferedLines");
const BUF_SIZE = 100000;
const bufferPair = {
    buf1: Buffer.alloc(BUF_SIZE),
    buf2: Buffer.alloc(BUF_SIZE),
    busy: true
};
const lineBasedCompareSync = (path1, stat1, path2, stat2, options) => {
    var _a;
    const bufferSize = Math.min(BUF_SIZE, (_a = options.lineBasedHandlerBufferSize) !== null && _a !== void 0 ? _a : Number.MAX_VALUE);
    let context;
    try {
        context = new LineBasedCompareContext_1.LineBasedCompareContext(fs_1.default.openSync(path1, 'r'), fs_1.default.openSync(path2, 'r'), bufferPair);
        for (;;) {
            const lineBatch1 = readLineBatchSync(context.fd1, context.buffer.buf1, bufferSize, context.rest.rest1, context.restLines.restLines1);
            const lineBatch2 = readLineBatchSync(context.fd2, context.buffer.buf2, bufferSize, context.rest.rest2, context.restLines.restLines2);
            context.rest.rest1 = lineBatch1.rest;
            context.rest.rest2 = lineBatch2.rest;
            const compareResult = compareLineBatches_1.compareLineBatches(lineBatch1, lineBatch2, options);
            if (!compareResult.batchIsEqual) {
                return false;
            }
            if (compareResult.reachedEof) {
                return compareResult.batchIsEqual;
            }
            context.restLines.restLines1 = compareResult.restLines.restLines1;
            context.restLines.restLines2 = compareResult.restLines.restLines2;
        }
    }
    finally {
        closeFile_1.default.closeFilesSync(context === null || context === void 0 ? void 0 : context.fd1, context === null || context === void 0 ? void 0 : context.fd2);
    }
};
exports.lineBasedCompareSync = lineBasedCompareSync;
/**
 * Reads a batch of lines from file starting with current position.
 *
 * @param fd File to read lines from.
 * @param buf Buffer used as temporary line storage.
 * @param bufferSize Allocated buffer size. The number of lines in the batch is limited by this size.
 * @param rest Part of a line that was split at buffer boundary in a previous read.
 *             Will be added to result.
 * @param restLines Lines that remain unprocessed from a previous read.
 *             Will be added to result.
 */
function readLineBatchSync(fd, buf, bufferSize, rest, restLines) {
    const size = fs_1.default.readSync(fd, buf, 0, bufferSize, null);
    return readBufferedLines_1.readBufferedLines(buf, size, bufferSize, rest, restLines);
}
//# sourceMappingURL=compareSync.js.map