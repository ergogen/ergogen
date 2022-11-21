"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareLines = void 0;
const TRIM_WHITE_SPACES_REGEXP = /^[ \f\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+|[ \f\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+$/g;
const TRIM_LINE_ENDING_REGEXP = /\r\n|\n$/g;
const REMOVE_WHITE_SPACES_REGEXP = /[ \f\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/g;
function compareLines(lines1, lines2, options) {
    if (options.ignoreEmptyLines) {
        lines1 = removeEmptyLines(lines1);
        lines2 = removeEmptyLines(lines2);
    }
    const len = Math.min(lines1.length, lines2.length);
    let i = 0;
    for (; i < len; i++) {
        const isEqual = compareLine(options, lines1[i], lines2[i]);
        if (!isEqual) {
            return { isEqual: false, restLines1: [], restLines2: [] };
        }
    }
    return {
        isEqual: true,
        restLines1: lines1.slice(i),
        restLines2: lines2.slice(i)
    };
}
exports.compareLines = compareLines;
function compareLine(options, line1, line2) {
    if (options.ignoreLineEnding) {
        line1 = trimLineEnding(line1);
        line2 = trimLineEnding(line2);
    }
    if (options.ignoreWhiteSpaces) {
        line1 = trimSpaces(line1);
        line2 = trimSpaces(line2);
    }
    if (options.ignoreAllWhiteSpaces) {
        line1 = removeSpaces(line1);
        line2 = removeSpaces(line2);
    }
    return line1 === line2;
}
// Trims string like '   abc   \n' into 'abc\n'
function trimSpaces(s) {
    const { content, lineEnding } = separateEol(s);
    const trimmed = content.replace(TRIM_WHITE_SPACES_REGEXP, '');
    return trimmed + lineEnding;
}
function trimLineEnding(s) {
    return s.replace(TRIM_LINE_ENDING_REGEXP, '');
}
function removeSpaces(s) {
    return s.replace(REMOVE_WHITE_SPACES_REGEXP, '');
}
function removeEmptyLines(lines) {
    return lines.filter(line => !isEmptyLine(line));
}
function isEmptyLine(line) {
    return line === '\n' || line === '\r\n';
}
function separateEol(s) {
    const len = s.length;
    let lineEnding = '';
    let content = s;
    if (s[len - 1] === '\n') {
        if (s[len - 2] === '\r') {
            return {
                lineEnding: '\r\n',
                content: s.slice(0, len - 2)
            };
        }
        {
            lineEnding = '\n';
            content = s.slice(0, len - 1);
        }
    }
    return { content, lineEnding };
}
//# sourceMappingURL=compareLines.js.map