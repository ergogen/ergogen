"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEqualNumber = exports.createEqual = void 0;

var _factory = require("../../utils/factory.js");

var _algorithm = require("../../type/matrix/utils/algorithm03.js");

var _algorithm2 = require("../../type/matrix/utils/algorithm07.js");

var _algorithm3 = require("../../type/matrix/utils/algorithm12.js");

var _algorithm4 = require("../../type/matrix/utils/algorithm13.js");

var _algorithm5 = require("../../type/matrix/utils/algorithm14.js");

var name = 'equal';
var dependencies = ['typed', 'matrix', 'equalScalar', 'DenseMatrix'];
var createEqual = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix,
      equalScalar = _ref.equalScalar,
      DenseMatrix = _ref.DenseMatrix;
  var algorithm03 = (0, _algorithm.createAlgorithm03)({
    typed: typed
  });
  var algorithm07 = (0, _algorithm2.createAlgorithm07)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm12 = (0, _algorithm3.createAlgorithm12)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm13 = (0, _algorithm4.createAlgorithm13)({
    typed: typed
  });
  var algorithm14 = (0, _algorithm5.createAlgorithm14)({
    typed: typed
  });
  /**
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is only
   * equal to `null` and nothing else, and `undefined` is only equal to
   * `undefined` and nothing else. Strings are compared by their numerical value.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    math.equal(2 + 2, 3)         // returns false
   *    math.equal(2 + 2, 4)         // returns true
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.equal(a, b)             // returns true
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.equal(c, d)             // returns [true, false, true]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.equal("1000", "1e3")    // returns true
   *    math.equal(0, null)          // returns false
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual, equalText
   *
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} x First value to compare
   * @param  {number | BigNumber | boolean | Complex | Unit | string | Array | Matrix} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */

  return typed(name, {
    'any, any': function anyAny(x, y) {
      // strict equality for null and undefined?
      if (x === null) {
        return y === null;
      }

      if (y === null) {
        return x === null;
      }

      if (x === undefined) {
        return y === undefined;
      }

      if (y === undefined) {
        return x === undefined;
      }

      return equalScalar(x, y);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm07(x, y, equalScalar);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm03(y, x, equalScalar, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm03(x, y, equalScalar, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, equalScalar);
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
      return algorithm12(x, y, equalScalar, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, equalScalar, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm12(y, x, equalScalar, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, equalScalar, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, equalScalar, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, equalScalar, true).valueOf();
    }
  });
});
exports.createEqual = createEqual;
var createEqualNumber = (0, _factory.factory)(name, ['typed', 'equalScalar'], function (_ref2) {
  var typed = _ref2.typed,
      equalScalar = _ref2.equalScalar;
  return typed(name, {
    'any, any': function anyAny(x, y) {
      // strict equality for null and undefined?
      if (x === null) {
        return y === null;
      }

      if (y === null) {
        return x === null;
      }

      if (x === undefined) {
        return y === undefined;
      }

      if (y === undefined) {
        return x === undefined;
      }

      return equalScalar(x, y);
    }
  });
});
exports.createEqualNumber = createEqualNumber;