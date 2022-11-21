"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lineBasedCompareAsync = void 0;
const FileDescriptorQueue_1 = require("../../fs/FileDescriptorQueue");
const closeFile_1 = __importDefault(require("../../fs/closeFile"));
const fsPromise_1 = __importDefault(require("../../fs/fsPromise"));
const LineBasedCompareContext_1 = require("./LineBasedCompareContext");
const BufferPool_1 = require("../../fs/BufferPool");
const compareLineBatches_1 = require("./compare/compareLineBatches");
const readBufferedLines_1 = require("./lineReader/readBufferedLines");
const BUF_SIZE = 100000;
const MAX_CONCURRENT_FILE_COMPARE = 8;
const fdQueue = new FileDescriptorQueue_1.FileDescriptorQueue(MAX_CONCURRENT_FILE_COMPARE * 2);
const bufferPool = new BufferPool_1.BufferPool(BUF_SIZE, MAX_CONCURRENT_FILE_COMPARE); // fdQueue guarantees there will be no more than MAX_CONCURRENT_FILE_COMPARE async processes accessing the buffers concurrently
const lineBasedCompareAsync = (path1, stat1, path2, stat2, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const bufferSize = Math.min(BUF_SIZE, (_a = options.lineBasedHandlerBufferSize) !== null && _a !== void 0 ? _a : Number.MAX_VALUE);
    let context;
    try {
        const fileDescriptors = yield Promise.all([fdQueue.openPromise(path1, 'r'), fdQueue.openPromise(path2, 'r')]);
        context = new LineBasedCompareContext_1.LineBasedCompareContext(fileDescriptors[0], fileDescriptors[1], bufferPool.allocateBuffers());
        for (;;) {
            const lineBatch1 = yield readLineBatchAsync(context.fd1, context.buffer.buf1, bufferSize, context.rest.rest1, context.restLines.restLines1);
            const lineBatch2 = yield readLineBatchAsync(context.fd2, context.buffer.buf2, bufferSize, context.rest.rest2, context.restLines.restLines2);
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
        if (context) {
            bufferPool.freeBuffers(context.buffer);
            yield closeFile_1.default.closeFilesAsync(context.fd1, context.fd2, fdQueue);
        }
    }
});
exports.lineBasedCompareAsync = lineBasedCompareAsync;
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
function readLineBatchAsync(fd, buf, bufferSize, rest, restLines) {
    return __awaiter(this, void 0, void 0, function* () {
        const size = yield fsPromise_1.default.read(fd, buf, 0, bufferSize, null);
        return readBufferedLines_1.readBufferedLines(buf, size, bufferSize, rest, restLines);
    });
}
//# sourceMappingURL=compareAsync.js.map