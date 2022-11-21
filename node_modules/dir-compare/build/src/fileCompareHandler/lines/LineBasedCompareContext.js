"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineBasedCompareContext = void 0;
class LineBasedCompareContext {
    constructor(fd1, fd2, bufferPair) {
        /**
         * Part of a line that was split at buffer boundary in a previous read.
         * Will be prefixed to the next read.
         */
        this.rest = { rest1: '', rest2: '' };
        /**
         * Lines that remain unprocessed from a previous read.
         * Will be prefixed to the next read.
         */
        this.restLines = { restLines1: [], restLines2: [] };
        this.fd1 = fd1;
        this.fd2 = fd2;
        this.buffer = bufferPair;
    }
}
exports.LineBasedCompareContext = LineBasedCompareContext;
//# sourceMappingURL=LineBasedCompareContext.js.map