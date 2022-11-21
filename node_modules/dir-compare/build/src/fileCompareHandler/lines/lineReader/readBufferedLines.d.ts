/// <reference types="node" />
import { LineBatch } from './LineBatch';
/**
 * Reads lines from given buffer.
 * @param buf Buffer to read lines from.
 * @param size Size of data available in buffer.
 * @param allocatedBufferSize Maximum buffer storage.
 * @param rest Part of a line that was split at buffer boundary in a previous read.
 *             Will be added to result.
 * @param restLines Lines that remain unprocessed from a previous read due to unbalanced buffers.
 *             Will be added to result.
 */
export declare function readBufferedLines(buf: Buffer, size: number, allocatedBufferSize: number, rest: string, restLines: string[]): LineBatch;
//# sourceMappingURL=readBufferedLines.d.ts.map