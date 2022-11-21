import { CompareFileHandler } from './types';
export interface FileCompareHandlers {
    /**
     * Default file content comparison handlers, used if [[Options.compareFileAsync]] or [[Options.compareFileSync]] are not specified.
     *
     * Performs binary comparison.
     */
    defaultFileCompare: CompareFileHandler;
    /**
     * Compares files line by line.
     *
     * Options:
     * * ignoreLineEnding - true/false (default: false) - Ignore cr/lf line endings
     * * ignoreWhiteSpaces - true/false (default: false) - Ignore white spaces at the beginning and ending of a line (similar to 'diff -b')
     * * ignoreAllWhiteSpaces - true/false (default: false) - Ignore all white space differences (similar to 'diff -w')
     * * ignoreEmptyLines - true/false (default: false) - Ignores differences caused by empty lines (similar to 'diff -B')
     */
    lineBasedFileCompare: CompareFileHandler;
}
//# sourceMappingURL=FileCompareHandlers.d.ts.map