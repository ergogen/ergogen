import { Options, Result } from './types';
import { FileCompareHandlers } from './FileCompareHandlers';
export * from './types';
export { FileCompareHandlers };
/**
 * Synchronously compares given paths.
 * @param path1 Left file or directory to be compared.
 * @param path2 Right file or directory to be compared.
 * @param options Comparison options.
 */
export declare function compareSync(path1: string, path2: string, options?: Options): Result;
/**
 * Asynchronously compares given paths.
 * @param path1 Left file or directory to be compared.
 * @param path2 Right file or directory to be compared.
 * @param options Comparison options.
 */
export declare function compare(path1: string, path2: string, options?: Options): Promise<Result>;
/**
 * File comparison handlers.
 * These handlers are used when [[Options.compareContent]] is set.
 */
export declare const fileCompareHandlers: FileCompareHandlers;
//# sourceMappingURL=index.d.ts.map