import { factory } from '../../utils/factory.js';
import { format } from '../../utils/string.js';
import { createComplexEigs } from './eigs/complexEigs.js';
import { createRealSymmetric } from './eigs/realSymetric.js';
import { typeOf, isNumber, isBigNumber, isComplex, isFraction } from '../../utils/is.js';
var name = 'eigs'; // The absolute state of math.js's dependency system:

var dependencies = ['config', 'typed', 'matrix', 'addScalar', 'equal', 'subtract', 'abs', 'atan', 'cos', 'sin', 'multiplyScalar', 'divideScalar', 'inv', 'bignumber', 'multiply', 'add', 'larger', 'column', 'flatten', 'number', 'complex', 'sqrt', 'diag', 'qr', 'usolve', 'usolveAll', 'im', 're', 'smaller', 'matrixFromColumns', 'dot'];
export var createEigs = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    config,
    typed,
    matrix,
    addScalar,
    subtract,
    equal,
    abs,
    atan,
    cos,
    sin,
    multiplyScalar,
    divideScalar,
    inv,
    bignumber,
    multiply,
    add,
    larger,
    column,
    flatten,
    number,
    complex,
    sqrt,
    diag,
    qr,
    usolve,
    usolveAll,
    im,
    re,
    smaller,
    matrixFromColumns,
    dot
  } = _ref;
  var doRealSymetric = createRealSymmetric({
    config,
    addScalar,
    subtract,
    column,
    flatten,
    equal,
    abs,
    atan,
    cos,
    sin,
    multiplyScalar,
    inv,
    bignumber,
    complex,
    multiply,
    add
  });
  var doComplexEigs = createComplexEigs({
    config,
    addScalar,
    subtract,
    multiply,
    multiplyScalar,
    flatten,
    divideScalar,
    sqrt,
    abs,
    bignumber,
    diag,
    qr,
    inv,
    usolve,
    usolveAll,
    equal,
    complex,
    larger,
    smaller,
    matrixFromColumns,
    dot
  });
  /**
   * Compute eigenvalues and eigenvectors of a matrix. The eigenvalues are sorted by their absolute value, ascending.
   * An eigenvalue with multiplicity k will be listed k times. The eigenvectors are returned as columns of a matrix –
   * the eigenvector that belongs to the j-th eigenvalue in the list (eg. `values[j]`) is the j-th column (eg. `column(vectors, j)`).
   * If the algorithm fails to converge, it will throw an error – in that case, however, you may still find useful information
   * in `err.values` and `err.vectors`.
   *
   * Syntax:
   *
   *     math.eigs(x, [prec])
   *
   * Examples:
   *
   *     const { eigs, multiply, column, transpose } = math
   *     const H = [[5, 2.3], [2.3, 1]]
   *     const ans = eigs(H) // returns {values: [E1,E2...sorted], vectors: [v1,v2.... corresponding vectors as columns]}
   *     const E = ans.values
   *     const U = ans.vectors
   *     multiply(H, column(U, 0)) // returns multiply(E[0], column(U, 0))
   *     const UTxHxU = multiply(transpose(U), H, U) // diagonalizes H
   *     E[0] == UTxHxU[0][0]  // returns true
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   *
   * @param {number | BigNumber} [prec] Precision, default value: 1e-15
   * @return {{values: Array|Matrix, vectors: Array|Matrix}} Object containing an array of eigenvalues and a matrix with eigenvectors as columns.
   *
   */

  return typed('eigs', {
    Array: function Array(x) {
      var mat = matrix(x);
      return computeValuesAndVectors(mat);
    },
    'Array, number|BigNumber': function ArrayNumberBigNumber(x, prec) {
      var mat = matrix(x);
      return computeValuesAndVectors(mat, prec);
    },
    Matrix: function Matrix(mat) {
      var {
        values,
        vectors
      } = computeValuesAndVectors(mat);
      return {
        values: matrix(values),
        vectors: matrix(vectors)
      };
    },
    'Matrix, number|BigNumber': function MatrixNumberBigNumber(mat, prec) {
      var {
        values,
        vectors
      } = computeValuesAndVectors(mat, prec);
      return {
        values: matrix(values),
        vectors: matrix(vectors)
      };
    }
  });

  function computeValuesAndVectors(mat, prec) {
    if (prec === undefined) {
      prec = config.epsilon;
    }

    var size = mat.size();

    if (size.length !== 2 || size[0] !== size[1]) {
      throw new RangeError('Matrix must be square (size: ' + format(size) + ')');
    }

    var arr = mat.toArray();
    var N = size[0];

    if (isReal(arr, N, prec)) {
      coerceReal(arr, N);

      if (isSymmetric(arr, N, prec)) {
        var _type = coerceTypes(mat, arr, N);

        return doRealSymetric(arr, N, prec, _type);
      }
    }

    var type = coerceTypes(mat, arr, N);
    return doComplexEigs(arr, N, prec, type);
  }
  /** @return {boolean} */


  function isSymmetric(arr, N, prec) {
    for (var i = 0; i < N; i++) {
      for (var j = i; j < N; j++) {
        // TODO proper comparison of bignum and frac
        if (larger(bignumber(abs(subtract(arr[i][j], arr[j][i]))), prec)) {
          return false;
        }
      }
    }

    return true;
  }
  /** @return {boolean} */


  function isReal(arr, N, prec) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        // TODO proper comparison of bignum and frac
        if (larger(bignumber(abs(im(arr[i][j]))), prec)) {
          return false;
        }
      }
    }

    return true;
  }

  function coerceReal(arr, N) {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        arr[i][j] = re(arr[i][j]);
      }
    }
  }
  /** @return {'number' | 'BigNumber' | 'Complex'} */


  function coerceTypes(mat, arr, N) {
    /** @type {string} */
    var type = mat.datatype();

    if (type === 'number' || type === 'BigNumber' || type === 'Complex') {
      return type;
    }

    var hasNumber = false;
    var hasBig = false;
    var hasComplex = false;

    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        var el = arr[i][j];

        if (isNumber(el) || isFraction(el)) {
          hasNumber = true;
        } else if (isBigNumber(el)) {
          hasBig = true;
        } else if (isComplex(el)) {
          hasComplex = true;
        } else {
          throw TypeError('Unsupported type in Matrix: ' + typeOf(el));
        }
      }
    }

    if (hasBig && hasComplex) {
      console.warn('Complex BigNumbers not supported, this operation will lose precission.');
    }

    if (hasComplex) {
      for (var _i = 0; _i < N; _i++) {
        for (var _j = 0; _j < N; _j++) {
          arr[_i][_j] = complex(arr[_i][_j]);
        }
      }

      return 'Complex';
    }

    if (hasBig) {
      for (var _i2 = 0; _i2 < N; _i2++) {
        for (var _j2 = 0; _j2 < N; _j2++) {
          arr[_i2][_j2] = bignumber(arr[_i2][_j2]);
        }
      }

      return 'BigNumber';
    }

    if (hasNumber) {
      for (var _i3 = 0; _i3 < N; _i3++) {
        for (var _j3 = 0; _j3 < N; _j3++) {
          arr[_i3][_j3] = number(arr[_i3][_j3]);
        }
      }

      return 'number';
    } else {
      throw TypeError('Matrix contains unsupported types only.');
    }
  }
});