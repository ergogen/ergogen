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
exports.defaultFileCompare = void 0;
const fs_1 = __importDefault(require("fs"));
const buffer_equal_1 = __importDefault(require("buffer-equal"));
const FileDescriptorQueue_1 = require("../../fs/FileDescriptorQueue");
const fsPromise_1 = __importDefault(require("../../fs/fsPromise"));
const BufferPool_1 = require("../../fs/BufferPool");
const closeFile_1 = __importDefault(require("../../fs/closeFile"));
const MAX_CONCURRENT_FILE_COMPARE = 8;
const BUF_SIZE = 100000;
const fdQueue = new FileDescriptorQueue_1.FileDescriptorQueue(MAX_CONCURRENT_FILE_COMPARE * 2);
const bufferPool = new BufferPool_1.BufferPool(BUF_SIZE, MAX_CONCURRENT_FILE_COMPARE); // fdQueue guarantees there will be no more than MAX_CONCURRENT_FILE_COMPARE async processes accessing the buffers concurrently
exports.defaultFileCompare = {
    /**
     * Compares two files by content.
     */
    compareSync(path1, stat1, path2, stat2, options) {
        let fd1;
        let fd2;
        if (stat1.size !== stat2.size) {
            return false;
        }
        const bufferPair = bufferPool.allocateBuffers();
        try {
            fd1 = fs_1.default.openSync(path1, 'r');
            fd2 = fs_1.default.openSync(path2, 'r');
            const buf1 = bufferPair.buf1;
            const buf2 = bufferPair.buf2;
            for (;;) {
                const size1 = fs_1.default.readSync(fd1, buf1, 0, BUF_SIZE, null);
                const size2 = fs_1.default.readSync(fd2, buf2, 0, BUF_SIZE, null);
                if (size1 !== size2) {
                    return false;
                }
                else if (size1 === 0) {
                    // End of file reached
                    return true;
                }
                else if (!compareBuffers(buf1, buf2, size1)) {
                    return false;
                }
            }
        }
        finally {
            closeFile_1.default.closeFilesSync(fd1, fd2);
            bufferPool.freeBuffers(bufferPair);
        }
    },
    /**
     * Compares two files by content
     */
    compareAsync(path1, stat1, path2, stat2, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let fd1;
            let fd2;
            let bufferPair;
            if (stat1.size !== stat2.size) {
                return Promise.resolve(false);
            }
            return Promise.all([fdQueue.openPromise(path1, 'r'), fdQueue.openPromise(path2, 'r')])
                .then(fds => {
                bufferPair = bufferPool.allocateBuffers();
                fd1 = fds[0];
                fd2 = fds[1];
                const buf1 = bufferPair.buf1;
                const buf2 = bufferPair.buf2;
                const compareAsyncInternal = () => Promise.all([
                    fsPromise_1.default.read(fd1, buf1, 0, BUF_SIZE, null),
                    fsPromise_1.default.read(fd2, buf2, 0, BUF_SIZE, null)
                ])
                    .then((bufferSizes) => {
                    const size1 = bufferSizes[0];
                    const size2 = bufferSizes[1];
                    if (size1 !== size2) {
                        return false;
                    }
                    else if (size1 === 0) {
                        // End of file reached
                        return true;
                    }
                    else if (!compareBuffers(buf1, buf2, size1)) {
                        return false;
                    }
                    else {
                        return compareAsyncInternal();
                    }
                });
                return compareAsyncInternal();
            })
                .then(
            // 'finally' polyfill for node 8 and below
            res => finalizeAsync(fd1, fd2, bufferPair).then(() => res), err => finalizeAsync(fd1, fd2, bufferPair).then(() => { throw err; }));
        });
    }
};
function compareBuffers(buf1, buf2, contentSize) {
    return buffer_equal_1.default(buf1.slice(0, contentSize), buf2.slice(0, contentSize));
}
function finalizeAsync(fd1, fd2, bufferPair) {
    if (bufferPair) {
        bufferPool.freeBuffers(bufferPair);
    }
    return closeFile_1.default.closeFilesAsync(fd1, fd2, fdQueue);
}
//# sourceMappingURL=defaultFileCompare.js.map