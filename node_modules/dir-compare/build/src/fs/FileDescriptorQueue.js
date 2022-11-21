"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDescriptorQueue = void 0;
const fs_1 = __importDefault(require("fs"));
const Queue_1 = __importDefault(require("./Queue"));
/**
 * Limits the number of concurrent file handlers.
 * Use it as a wrapper over fs.open() and fs.close().
 * Example:
 *  const fdQueue = new FileDescriptorQueue(8)
 *  fdQueue.open(path, flags, (err, fd) =>{
 *    ...
 *    fdQueue.close(fd, (err) =>{
 *      ...
 *    })
 *  })
 *  As of node v7, calling fd.close without a callback is deprecated.
 */
class FileDescriptorQueue {
    constructor(maxFilesNo) {
        this.maxFilesNo = maxFilesNo;
        this.activeCount = 0;
        this.pendingJobs = new Queue_1.default();
    }
    open(path, flags, callback) {
        this.pendingJobs.enqueue({
            path: path,
            flags: flags,
            callback: callback
        });
        this.process();
    }
    process() {
        if (this.pendingJobs.getLength() > 0 && this.activeCount < this.maxFilesNo) {
            const job = this.pendingJobs.dequeue();
            this.activeCount++;
            fs_1.default.open(job.path, job.flags, job.callback);
        }
    }
    close(fd, callback) {
        this.activeCount--;
        fs_1.default.close(fd, callback);
        this.process();
    }
    openPromise(path, flags) {
        return new Promise((resolve, reject) => {
            this.open(path, flags, (err, fd) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(fd);
                }
            });
        });
    }
    closePromise(fd) {
        return new Promise((resolve, reject) => {
            this.close(fd, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.FileDescriptorQueue = FileDescriptorQueue;
//# sourceMappingURL=FileDescriptorQueue.js.map