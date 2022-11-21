"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMod = void 0;

var _factory = require("../../utils/factory.js");

var _algorithm = require("../../type/matrix/utils/algorithm02.js");

var _algorithm2 = require("../../type/matrix/utils/algorithm03.js");

var _algorithm3 = require("../../type/matrix/utils/algorithm05.js");

var _algorithm4 = require("../../type/matrix/utils/algorithm11.js");

var _algorithm5 = require("../../type/matrix/utils/algorithm12.js");

var _algorithm6 = require("../../type/matrix/utils/algorithm13.js");

var _algorithm7 = require("../../type/matrix/utils/algorithm14.js");

var _index = require("../../plain/number/index.js");

var name = 'mod';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix'];
var createMod = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix,
      equalScalar = _ref.equalScalar,
      DenseMatrix = _ref.DenseMatrix;
  var algorithm02 = (0, _algorithm.createAlgorithm02)({
    typed: typed,
    equalScalar: equalScalar
  });
  var algorithm03 = (0, _algorithm2.createAlgorithm03)({
    typed: typed
  });
  var algorithm05 = (0, _algorithm3.createAlgorithm05)({
    typed: typed,
    equalScalar: equalScalar
  });
  var algorithm11 = (0, _algorithm4.createAlgorithm11)({
    typed: typed,
    equalScalar: equalScalar
  });
  var algorithm12 = (0, _algorithm5.createAlgorithm12)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm13 = (0, _algorithm6.createAlgorithm13)({
    typed: typed
  });
  var algorithm14 = (0, _algorithm7.createAlgorithm14)({
    typed: typed
  });
  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   * For matrices, the function is evaluated element wise.
   *
   * The modulus is defined as:
   *
   *     x - y * floor(x / y)
   *
   * See https://en.wikipedia.org/wiki/Modulo_operation.
   *
   * Syntax:
   *
   *    math.mod(x, y)
   *
   * Examples:
   *
   *    math.mod(8, 3)                // returns 2
   *    math.mod(11, 2)               // returns 1
   *
   *    function isOdd(x) {
   *      return math.mod(x, 2) != 0
   *    }
   *
   *    isOdd(2)                      // returns false
   *    isOdd(3)                      // returns true
   *
   * See also:
   *
   *    divide
   *
   * @param  {number | BigNumber | Fraction | Array | Matrix} x Dividend
   * @param  {number | BigNumber | Fraction | Array | Matrix} y Divisor
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the remainder of `x` divided by `y`.
   */

  return typed(name, {
    'number, number': _index.modNumber,
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      if (y.isNeg()) {
        throw new Error('Cannot calculate mod for a negative divisor');
      }

      return y.isZero() ? x : x.mod(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      if (y.compare(0) < 0) {
        throw new Error('Cannot calculate mod for a negative divisor');
      } // Workaround suggested in Fraction.js library to calculate correct modulo for negative dividend


      return x.compare(0) >= 0 ? x.mod(y) : x.mod(y).add(y).mod(y);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm05(x, y, this, false);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm02(y, x, this, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm03(x, y, this, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, this);
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
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm11(x, y, this, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, this, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm12(y, x, this, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, this, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, this, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, this, true).valueOf();
    }
  });
});
exports.createMod = createMod;