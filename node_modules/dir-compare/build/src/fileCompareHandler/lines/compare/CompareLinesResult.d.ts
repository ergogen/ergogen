export interface CompareLinesResult {
    /**
     * Whether compared lines are identical.
     */
    isEqual: boolean;
    /**
     * Lines that were not compared due to unbalanced buffers.
     */
    restLines1: string[];
    /**
     * Lines that were not compared due to unbalanced buffers.
     */
    restLines2: string[];
}
//# sourceMappingURL=CompareLinesResult.d.ts.map