export interface LineBatch {
    /**
     * Batch of lines available after this read operation.
     */
    lines: string[];
    /**
     * First part of a line that was split due to buffer boundary.
     * It will be used in a subsequent read to complete the next line.
     */
    rest: string;
    /**
     * Whether we reached end of file.
     */
    reachedEof: boolean;
}
//# sourceMappingURL=LineBatch.d.ts.map