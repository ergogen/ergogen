import { BufferPair } from '../../fs/BufferPool';
interface RestPair {
    rest1: string;
    rest2: string;
}
interface RestLines {
    restLines1: string[];
    restLines2: string[];
}
export declare class LineBasedCompareContext {
    /**
     * File to compare.
     */
    fd1: number;
    /**
     * File to compare.
     */
    fd2: number;
    /**
     * Buffers used as temporary storage.
     */
    buffer: BufferPair;
    /**
     * Part of a line that was split at buffer boundary in a previous read.
     * Will be prefixed to the next read.
     */
    rest: RestPair;
    /**
     * Lines that remain unprocessed from a previous read.
     * Will be prefixed to the next read.
     */
    restLines: RestLines;
    constructor(fd1: number, fd2: number, bufferPair: BufferPair);
}
export {};
//# sourceMappingURL=LineBasedCompareContext.d.ts.map