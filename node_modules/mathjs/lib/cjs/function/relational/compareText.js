"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCompareTextNumber = exports.createCompareText = void 0;

var _string = require("../../utils/string.js");

var _factory = require("../../utils/factory.js");

var _algorithm = require("../../type/matrix/utils/algorithm14.js");

var _algorithm2 = require("../../type/matrix/utils/algorithm13.js");

var name = 'compareText';
var dependencies = ['typed', 'matrix'];
var createCompareText = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix;
  var algorithm13 = (0, _algorithm2.createAlgorithm13)({
    typed: typed
  });
  var algorithm14 = (0, _algorithm.createAlgorithm14)({
    typed: typed
  });
  /**
   * Compare two strings lexically. Comparison is case sensitive.
   * Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.compareText(x, y)
   *
   * Examples:
   *
   *    math.compareText('B', 'A')     // returns 1
   *    math.compareText('2', '10')    // returns 1
   *    math.compare('2', '10')        // returns -1
   *    math.compareNatural('2', '10') // returns -1
   *
   *    math.compareText('B', ['A', 'B', 'C']) // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, equalText, compare, compareNatural
   *
   * @param  {string | Array | DenseMatrix} x First string to compare
   * @param  {string | Array | DenseMatrix} y Second string to compare
   * @return {number | Array | DenseMatrix} Returns the result of the comparison:
   *                                        1 when x > y, -1 when x < y, and 0 when x == y.
   */

  return typed(name, {
    'any, any': _string.compareText,
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, _string.compareText);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return this(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return this(x, matrix(y));
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, _string.compareText, false);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, _string.compareText, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _string.compareText, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _string.compareText, true).valueOf();
    }
  });
});
exports.createCompareText = createCompareText;
var createCompareTextNumber = /* #__PURE__ */(0, _factory.factory)(name, ['typed'], function (_ref2) {
  var typed = _ref2.typed;
  return typed(name, {
    'any, any': _string.compareText
  });
});
exports.createCompareTextNumber = createCompareTextNumber;