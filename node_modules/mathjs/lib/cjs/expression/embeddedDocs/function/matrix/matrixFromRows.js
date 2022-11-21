"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.matrixFromRowsDocs = void 0;
var matrixFromRowsDocs = {
  name: 'matrixFromRows',
  category: 'Matrix',
  syntax: ['math.matrixFromRows(...arr)', 'math.matrixFromRows(row1, row2)', 'math.matrixFromRows(row1, row2, row3)'],
  description: 'Create a dense matrix from vectors as individual rows.',
  examples: ['matrixFromRows([1, 2, 3], [[4],[5],[6]])'],
  seealso: ['matrix', 'matrixFromColumns', 'matrixFromFunction', 'zeros']
};
exports.matrixFromRowsDocs = matrixFromRowsDocs;