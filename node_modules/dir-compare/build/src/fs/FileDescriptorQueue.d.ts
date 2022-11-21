/// <reference types="node" />
import { NoParamCallback } from 'fs';
declare type OpenFileFlags = string | undefined;
declare type OpenFileCallback = (err: NodeJS.ErrnoException | null, fd: number) => void;
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
export declare class FileDescriptorQueue {
    private maxFilesNo;
    private activeCount;
    private pendingJobs;
    constructor(maxFilesNo: number);
    open(path: string, flags: OpenFileFlags, callback: OpenFileCallback): void;
    process(): void;
    close(fd: number, callback: NoParamCallback): void;
    openPromise(path: string, flags: OpenFileFlags): Promise<number>;
    closePromise(fd: number): Promise<void>;
}
export {};
//# sourceMappingURL=FileDescriptorQueue.d.ts.map