import { Options } from '../../../index';
import { LineBatch } from '../lineReader/LineBatch';
interface RestLines {
    restLines1: string[];
    restLines2: string[];
}
interface CompareLineBatchResult {
    reachedEof: boolean;
    batchIsEqual: boolean;
    /**
     * Lines that were not compared because the two line batches
     * contained different number of lines.
     * These remaining lines will be compared in the next step.
     */
    restLines: RestLines;
}
/**
 * Compares two batches of lines.
 *
 * @param lineBatch1 Batch to compare.
 * @param lineBatch2 Batch to compare.
 * @param context Comparison context.
 * @param options Comparison options.
 */
export declare function compareLineBatches(lineBatch1: LineBatch, lineBatch2: LineBatch, options: Options): CompareLineBatchResult;
export {};
//# sourceMappingURL=compareLineBatches.d.ts.map