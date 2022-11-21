"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCompareNumber = exports.createCompare = void 0;

var _nearlyEqual = require("../../utils/bignumber/nearlyEqual.js");

var _number = require("../../utils/number.js");

var _factory = require("../../utils/factory.js");

var _algorithm = require("../../type/matrix/utils/algorithm03.js");

var _algorithm2 = require("../../type/matrix/utils/algorithm12.js");

var _algorithm3 = require("../../type/matrix/utils/algorithm14.js");

var _algorithm4 = require("../../type/matrix/utils/algorithm13.js");

var _algorithm5 = require("../../type/matrix/utils/algorithm05.js");

var name = 'compare';
var dependencies = ['typed', 'config', 'matrix', 'equalScalar', 'BigNumber', 'Fraction', 'DenseMatrix'];
var createCompare = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      equalScalar = _ref.equalScalar,
      matrix = _ref.matrix,
      BigNumber = _ref.BigNumber,
      Fraction = _ref.Fraction,
      DenseMatrix = _ref.DenseMatrix;
  var algorithm03 = (0, _algorithm.createAlgorithm03)({
    typed: typed
  });
  var algorithm05 = (0, _algorithm5.createAlgorithm05)({
    typed: typed,
    equalScalar: equalScalar
  });
  var algorithm12 = (0, _algorithm2.createAlgorithm12)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm13 = (0, _algorithm4.createAlgorithm13)({
    typed: typed
  });
  var algorithm14 = (0, _algorithm3.createAlgorithm14)({
    typed: typed
  });
  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1)           // returns 1
   *    math.compare(2, 3)           // returns -1
   *    math.compare(7, 7)           // returns 0
   *    math.compare('10', '2')      // returns 1
   *    math.compare('1000', '1e3')  // returns 0
   *
   *    const a = math.unit('5 cm')
   *    const b = math.unit('40 mm')
   *    math.compare(a, b)           // returns 1
   *
   *    math.compare(2, [1, 2, 3])   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq, compareNatural, compareText
   *
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | Fraction | Unit | string | Array | Matrix} y Second value to compare
   * @return {number | BigNumber | Fraction | Array | Matrix} Returns the result of the comparison:
   *                                                          1 when x > y, -1 when x < y, and 0 when x == y.
   */

  return typed(name, {
    'boolean, boolean': function booleanBoolean(x, y) {
      return x === y ? 0 : x > y ? 1 : -1;
    },
    'number, number': function numberNumber(x, y) {
      return (0, _number.nearlyEqual)(x, y, config.epsilon) ? 0 : x > y ? 1 : -1;
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return (0, _nearlyEqual.nearlyEqual)(x, y, config.epsilon) ? new BigNumber(0) : new BigNumber(x.cmp(y));
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return new Fraction(x.compare(y));
    },
    'Complex, Complex': function ComplexComplex() {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }

      return this(x.value, y.value);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm05(x, y, this);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm03(y, x, this, true);
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
      return algorithm12(x, y, this, false);
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
exports.createCompare = createCompare;
var createCompareNumber = /* #__PURE__ */(0, _factory.factory)(name, ['typed', 'config'], function (_ref2) {
  var typed = _ref2.typed,
      config = _ref2.config;
  return typed(name, {
    'number, number': function numberNumber(x, y) {
      return (0, _number.nearlyEqual)(x, y, config.epsilon) ? 0 : x > y ? 1 : -1;
    }
  });
});
exports.createCompareNumber = createCompareNumber;