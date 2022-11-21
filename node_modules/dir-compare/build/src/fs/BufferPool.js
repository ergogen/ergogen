"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferPool = void 0;
/**
 * Collection of buffers to be shared between async processes.
 * Avoids allocating buffers each time async process starts.
 */
class BufferPool {
    /**
     *
     * @param bufSize Size of each buffer.
     * @param bufNo Number of buffers. Caller has to make sure no more than bufNo async processes run simultaneously.
     */
    constructor(bufSize, bufNo) {
        this.bufSize = bufSize;
        this.bufNo = bufNo;
        this.bufferPool = [];
        for (let i = 0; i < this.bufNo; i++) {
            this.bufferPool.push({
                buf1: Buffer.alloc(this.bufSize),
                buf2: Buffer.alloc(this.bufSize),
                busy: false
            });
        }
    }
    allocateBuffers() {
        for (let j = 0; j < this.bufNo; j++) {
            const bufferPair = this.bufferPool[j];
            if (!bufferPair.busy) {
                bufferPair.busy = true;
                return bufferPair;
            }
        }
        throw new Error('Async buffer limit reached');
    }
    freeBuffers(bufferPair) {
        bufferPair.busy = false;
    }
}
exports.BufferPool = BufferPool;
//# sourceMappingURL=BufferPool.js.map