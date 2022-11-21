/// <reference types="node" />
export interface BufferPair {
    buf1: Buffer;
    buf2: Buffer;
    busy: boolean;
}
/**
 * Collection of buffers to be shared between async processes.
 * Avoids allocating buffers each time async process starts.
 */
export declare class BufferPool {
    private readonly bufSize;
    private readonly bufNo;
    private readonly bufferPool;
    /**
     *
     * @param bufSize Size of each buffer.
     * @param bufNo Number of buffers. Caller has to make sure no more than bufNo async processes run simultaneously.
     */
    constructor(bufSize: number, bufNo: number);
    allocateBuffers(): BufferPair;
    freeBuffers(bufferPair: BufferPair): void;
}
//# sourceMappingURL=BufferPool.d.ts.map