import { FileDescriptorQueue } from './FileDescriptorQueue';
declare function closeFilesSync(fd1?: number, fd2?: number): void;
declare function closeFilesAsync(fd1: number | undefined, fd2: number | undefined, fdQueue: FileDescriptorQueue): Promise<void>;
declare const _default: {
    closeFilesSync: typeof closeFilesSync;
    closeFilesAsync: typeof closeFilesAsync;
};
export default _default;
//# sourceMappingURL=closeFile.d.ts.map