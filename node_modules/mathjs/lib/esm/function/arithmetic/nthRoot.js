import { factory } from '../../utils/factory.js';
import { createAlgorithm01 } from '../../type/matrix/utils/algorithm01.js';
import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02.js';
import { createAlgorithm06 } from '../../type/matrix/utils/algorithm06.js';
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11.js';
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13.js';
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14.js';
import { nthRootNumber } from '../../plain/number/index.js';
var name = 'nthRoot';
var dependencies = ['typed', 'matrix', 'equalScalar', 'BigNumber'];
export var createNthRoot = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    matrix,
    equalScalar,
    BigNumber: _BigNumber
  } = _ref;
  var algorithm01 = createAlgorithm01({
    typed
  });
  var algorithm02 = createAlgorithm02({
    typed,
    equalScalar
  });
  var algorithm06 = createAlgorithm06({
    typed,
    equalScalar
  });
  var algorithm11 = createAlgorithm11({
    typed,
    equalScalar
  });
  var algorithm13 = createAlgorithm13({
    typed
  });
  var algorithm14 = createAlgorithm14({
    typed
  });
  /**
   * Calculate the nth root of a value.
   * The principal nth root of a positive real number A, is the positive real
   * solution of the equation
   *
   *     x^root = A
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *     math.nthRoot(a)
   *     math.nthRoot(a, root)
   *
   * Examples:
   *
   *     math.nthRoot(9, 2)    // returns 3, as 3^2 == 9
   *     math.sqrt(9)          // returns 3, as 3^2 == 9
   *     math.nthRoot(64, 3)   // returns 4, as 4^3 == 64
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param {number | BigNumber | Array | Matrix | Complex} a
   *              Value for which to calculate the nth root
   * @param {number | BigNumber} [root=2]    The root.
   * @return {number | Complex | Array | Matrix} Returns the nth root of `a`
   */

  var complexErr = '' + 'Complex number not supported in function nthRoot. ' + 'Use nthRoots instead.';
  return typed(name, {
    number: function number(x) {
      return nthRootNumber(x, 2);
    },
    'number, number': nthRootNumber,
    BigNumber: function BigNumber(x) {
      return _bigNthRoot(x, new _BigNumber(2));
    },
    Complex: function Complex(x) {
      throw new Error(complexErr);
    },
    'Complex, number': function ComplexNumber(x, y) {
      throw new Error(complexErr);
    },
    'BigNumber, BigNumber': _bigNthRoot,
    'Array | Matrix': function ArrayMatrix(x) {
      return this(x, 2);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse + sparse
        return algorithm06(x, y, this);
      } else {
        // throw exception
        throw new Error('Root must be non-zero');
      }
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm02(y, x, this, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // dense + sparse
        return algorithm01(x, y, this, false);
      } else {
        // throw exception
        throw new Error('Root must be non-zero');
      }
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
    'SparseMatrix, number | BigNumber': function SparseMatrixNumberBigNumber(x, y) {
      return algorithm11(x, y, this, false);
    },
    'DenseMatrix, number | BigNumber': function DenseMatrixNumberBigNumber(x, y) {
      return algorithm14(x, y, this, false);
    },
    'number | BigNumber, SparseMatrix': function numberBigNumberSparseMatrix(x, y) {
      // density must be one (no zeros in matrix)
      if (y.density() === 1) {
        // sparse - scalar
        return algorithm11(y, x, this, true);
      } else {
        // throw exception
        throw new Error('Root must be non-zero');
      }
    },
    'number | BigNumber, DenseMatrix': function numberBigNumberDenseMatrix(x, y) {
      return algorithm14(y, x, this, true);
    },
    'Array, number | BigNumber': function ArrayNumberBigNumber(x, y) {
      // use matrix implementation
      return this(matrix(x), y).valueOf();
    },
    'number | BigNumber, Array': function numberBigNumberArray(x, y) {
      // use matrix implementation
      return this(x, matrix(y)).valueOf();
    }
  });
  /**
   * Calculate the nth root of a for BigNumbers, solve x^root == a
   * https://rosettacode.org/wiki/Nth_root#JavaScript
   * @param {BigNumber} a
   * @param {BigNumber} root
   * @private
   */

  function _bigNthRoot(a, root) {
    var precision = _BigNumber.precision;

    var Big = _BigNumber.clone({
      precision: precision + 2
    });

    var zero = new _BigNumber(0);
    var one = new Big(1);
    var inv = root.isNegative();

    if (inv) {
      root = root.neg();
    }

    if (root.isZero()) {
      throw new Error('Root must be non-zero');
    }

    if (a.isNegative() && !root.abs().mod(2).equals(1)) {
      throw new Error('Root must be odd when a is negative.');
    } // edge cases zero and infinity


    if (a.isZero()) {
      return inv ? new Big(Infinity) : 0;
    }

    if (!a.isFinite()) {
      return inv ? zero : a;
    }

    var x = a.abs().pow(one.div(root)); // If a < 0, we require that root is an odd integer,
    // so (-1) ^ (1/root) = -1

    x = a.isNeg() ? x.neg() : x;
    return new _BigNumber((inv ? one.div(x) : x).toPrecision(precision));
  }
});
export var createNthRootNumber = /* #__PURE__ */factory(name, ['typed'], _ref2 => {
  var {
    typed
  } = _ref2;
  return typed(name, {
    number: nthRootNumber,
    'number, number': nthRootNumber
  });
});