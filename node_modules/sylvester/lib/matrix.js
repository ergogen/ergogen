'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _sylvester = require('./sylvester');

var _vector = require('./vector');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function sign(x) {
  return x < 0 ? -1 : 1;
}

// augment a matrix M with identity rows/cols
function identSize(M, m, n, k) {
  var e = M.elements;
  var i = k - 1;

  while (i--) {
    var row = [];

    for (var j = 0; j < n; j++) {
      row.push(j === i ? 1 : 0);
    }

    e.unshift(row);
  }

  for (var _i = k - 1; _i < m; _i++) {
    while (e[_i].length < n) {
      e[_i].unshift(0);
    }
  }

  return Matrix.create(e); // eslint-disable-line no-use-before-define
}

function pca(X) {
  var Sigma = X.transpose().x(X).x(1 / X.rows());
  var svd = Sigma.svd();
  return {
    U: svd.U,
    S: svd.S
  };
}

var Matrix = exports.Matrix = function () {
  function Matrix() {
    _classCallCheck(this, Matrix);
  }

  _createClass(Matrix, [{
    key: 'solve',

    // solve a system of linear equations (work in progress)
    value: function solve(b) {
      var lu = this.lu();
      b = lu.P.x(b);
      var y = lu.L.forwardSubstitute(b);
      var x = lu.U.backSubstitute(y);
      return lu.P.x(x);
      // return this.inv().x(b);
    }

    // project a matrix onto a lower dim

  }, {
    key: 'pcaProject',
    value: function pcaProject(k) {
      var U = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : pca(this).U;

      var Ureduce = U.slice(1, U.rows(), 1, k);
      return {
        Z: this.x(Ureduce),
        U: U
      };
    }

    // recover a matrix to a higher dimension

  }, {
    key: 'pcaRecover',
    value: function pcaRecover(U) {
      var k = this.cols();
      var Ureduce = U.slice(1, U.rows(), 1, k);
      return this.x(Ureduce.transpose());
    }

    // grab the upper triangular part of the matrix

  }, {
    key: 'triu',
    value: function triu(k) {
      if (!k) {
        k = 0;
      }

      return this.map(function (x, i, j) {
        return j - i >= k ? x : 0;
      });
    }

    // unroll a matrix into a vector

  }, {
    key: 'unroll',
    value: function unroll() {
      var v = [];

      for (var i = 1; i <= this.cols(); i++) {
        for (var j = 1; j <= this.rows(); j++) {
          v.push(this.e(j, i));
        }
      }

      return _vector.Vector.create(v);
    }

    // return a sub-block of the matrix

  }, {
    key: 'slice',
    value: function slice(startRow, endRow, startCol, endCol) {
      var x = [];

      if (endRow === 0) {
        endRow = this.rows();
      }

      if (endCol === 0) {
        endCol = this.cols();
      }

      for (var i = startRow; i <= endRow; i++) {
        var row = [];

        for (var j = startCol; j <= endCol; j++) {
          row.push(this.e(i, j));
        }

        x.push(row);
      }

      return Matrix.create(x);
    }

    // Returns element (i,j) of the matrix

  }, {
    key: 'e',
    value: function e(i, j) {
      if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) {
        return null;
      }
      return this.elements[i - 1][j - 1];
    }

    // Returns row k of the matrix as a vector

  }, {
    key: 'row',
    value: function row(i) {
      if (i > this.elements.length) {
        return null;
      }
      return _vector.Vector.create(this.elements[i - 1]);
    }

    // Returns column k of the matrix as a vector

  }, {
    key: 'col',
    value: function col(j) {
      if (j > this.elements[0].length) {
        return null;
      }
      var col = [];
      var n = this.elements.length;
      for (var i = 0; i < n; i++) {
        col.push(this.elements[i][j - 1]);
      }
      return _vector.Vector.create(col);
    }

    // Returns the number of rows/columns the matrix has

  }, {
    key: 'dimensions',
    value: function dimensions() {
      return {
        rows: this.elements.length,
        cols: this.elements[0].length
      };
    }

    // Returns the number of rows in the matrix

  }, {
    key: 'rows',
    value: function rows() {
      return this.elements.length;
    }

    // Returns the number of columns in the matrix

  }, {
    key: 'cols',
    value: function cols() {
      return this.elements[0].length;
    }
  }, {
    key: 'approxEql',
    value: function approxEql(matrix) {
      return this.eql(matrix, _sylvester.Sylvester.approxPrecision);
    }

    // Returns true iff the matrix is equal to the argument. You can supply
    // a vector as the argument, in which case the receiver must be a
    // one-column matrix equal to the vector.

  }, {
    key: 'eql',
    value: function eql(matrix, precision) {
      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      if (this.elements.length !== M.length || this.elements[0].length !== M[0].length) {
        return false;
      }
      var i = this.elements.length;
      var nj = this.elements[0].length;
      var j = void 0;
      while (i--) {
        j = nj;
        while (j--) {
          if (Math.abs(this.elements[i][j] - M[i][j]) > (precision || _sylvester.Sylvester.precision)) {
            return false;
          }
        }
      }
      return true;
    }

    // Returns a copy of the matrix

  }, {
    key: 'dup',
    value: function dup() {
      return Matrix.create(this.elements);
    }

    // Maps the matrix to another matrix (of the same dimensions) according to the given function

  }, {
    key: 'map',
    value: function map(fn) {
      var els = [];
      var i = this.elements.length;
      var nj = this.elements[0].length;
      var j = void 0;
      while (i--) {
        j = nj;
        els[i] = [];
        while (j--) {
          els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
        }
      }
      return Matrix.create(els);
    }

    // Returns true iff the argument has the same dimensions as the matrix

  }, {
    key: 'isSameSizeAs',
    value: function isSameSizeAs(matrix) {
      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      return this.elements.length === M.length && this.elements[0].length === M[0].length;
    }

    // Returns the result of adding the argument to the matrix

  }, {
    key: 'add',
    value: function add(matrix) {
      if (typeof matrix === 'number') {
        return this.map(function (x) {
          return x + matrix;
        });
      }

      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      if (!this.isSameSizeAs(M)) {
        return null;
      }
      return this.map(function (x, i, j) {
        return x + M[i - 1][j - 1];
      });
    }

    // Returns the result of subtracting the argument from the matrix

  }, {
    key: 'subtract',
    value: function subtract(matrix) {
      if (typeof matrix === 'number') {
        return this.map(function (x) {
          return x - matrix;
        });
      }

      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      if (!this.isSameSizeAs(M)) {
        return null;
      }
      return this.map(function (x, i, j) {
        return x - M[i - 1][j - 1];
      });
    }

    // Returns true iff the matrix can multiply the argument from the left

  }, {
    key: 'canMultiplyFromLeft',
    value: function canMultiplyFromLeft(matrix) {
      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      // this.columns should equal matrix.rows
      return this.elements[0].length === M.length;
    }

    // Returns the result of a multiplication-style operation the matrix from the right by the argument.
    // If the argument is a scalar then just operate on all the elements. If the argument is
    // a vector, a vector is returned, which saves you having to remember calling
    // col(1) on the result.

  }, {
    key: 'mulOp',
    value: function mulOp(matrix, op) {
      if (!matrix.elements) {
        return this.map(function (x) {
          return op(x, matrix);
        });
      }

      var returnVector = Boolean(matrix.modulus);
      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      if (!this.canMultiplyFromLeft(M)) {
        return null;
      }
      var e = this.elements;
      var rowThis = void 0;
      var rowElem = void 0;
      var elements = [];
      var sum = void 0;
      var m = e.length;
      var n = M[0].length;
      var o = e[0].length;
      var i = m;
      var j = void 0;
      var k = void 0;

      while (i--) {
        rowElem = [];
        rowThis = e[i];
        j = n;

        while (j--) {
          sum = 0;
          k = o;

          while (k--) {
            sum += op(rowThis[k], M[k][j]);
          }

          rowElem[j] = sum;
        }

        elements[i] = rowElem;
      }

      var output = Matrix.create(elements);
      return returnVector ? output.col(1) : output;
    }

    // Returns the result of dividing the matrix from the right by the argument.
    // If the argument is a scalar then just divide all the elements. If the argument is
    // a vector, a vector is returned, which saves you having to remember calling
    // col(1) on the result.

  }, {
    key: 'div',
    value: function div(matrix) {
      return this.mulOp(matrix, function (x, y) {
        return x / y;
      });
    }

    // Returns the result of multiplying the matrix from the right by the argument.
    // If the argument is a scalar then just multiply all the elements. If the argument is
    // a vector, a vector is returned, which saves you having to remember calling
    // col(1) on the result.

  }, {
    key: 'multiply',
    value: function multiply(matrix) {
      return this.mulOp(matrix, function (x, y) {
        return x * y;
      });
    }
  }, {
    key: 'x',
    value: function x(matrix) {
      return this.multiply(matrix);
    }
  }, {
    key: 'elementMultiply',
    value: function elementMultiply(v) {
      return this.map(function (k, i, j) {
        return v.e(i, j) * k;
      });
    }

    // sum all elements in the matrix

  }, {
    key: 'sum',
    value: function sum() {
      var sum = 0;
      this.map(function (x) {
        // eslint-disable-line array-callback-return
        sum += x;
      });
      return sum;
    }

    // Returns a Vector of each colum averaged.

  }, {
    key: 'mean',
    value: function mean() {
      var dim = this.dimensions();
      var r = [];
      for (var i = 1; i <= dim.cols; i++) {
        r.push(this.col(i).sum() / dim.rows);
      }
      return _vector.Vector.create(r);
    }

    // Returns a Vector of each column's standard deviation

  }, {
    key: 'std',
    value: function std() {
      var dim = this.dimensions();
      var mMean = this.mean();
      var r = [];
      for (var i = 1; i <= dim.cols; i++) {
        var meanDiff = this.col(i).subtract(mMean.e(i));
        meanDiff = meanDiff.multiply(meanDiff);
        r.push(Math.sqrt(meanDiff.sum() / dim.rows));
      }
      return _vector.Vector.create(r);
    }
  }, {
    key: 'column',
    value: function column(n) {
      return this.col(n);
    }

    // element-wise log

  }, {
    key: 'log',
    value: function log() {
      return this.map(function (x) {
        return Math.log(x);
      });
    }

    // Returns a submatrix taken from the matrix
    // Argument order is: start row, start col, nrows, ncols
    // Element selection wraps if the required index is outside the matrix's bounds, so you could
    // use this to perform row/column cycling or copy-augmenting.

  }, {
    key: 'minor',
    value: function minor(a, b, c, d) {
      var elements = [];
      var ni = c;
      var i = void 0;
      var nj = void 0;
      var j = void 0;
      var rows = this.elements.length;
      var cols = this.elements[0].length;
      while (ni--) {
        i = c - ni - 1;
        elements[i] = [];
        nj = d;
        while (nj--) {
          j = d - nj - 1;
          elements[i][j] = this.elements[(a + i - 1) % rows][(b + j - 1) % cols];
        }
      }
      return Matrix.create(elements);
    }

    // Returns the transpose of the matrix

  }, {
    key: 'transpose',
    value: function transpose() {
      var rows = this.elements.length;
      var cols = this.elements[0].length;
      var elements = [];
      var i = cols;
      var j = void 0;
      while (i--) {
        j = rows;
        elements[i] = [];
        while (j--) {
          elements[i][j] = this.elements[j][i];
        }
      }
      return Matrix.create(elements);
    }

    // Returns true iff the matrix is square

  }, {
    key: 'isSquare',
    value: function isSquare() {
      return this.elements.length === this.elements[0].length;
    }

    // Returns the (absolute) largest element of the matrix

  }, {
    key: 'max',
    value: function max() {
      var m = 0;
      var i = this.elements.length;
      var nj = this.elements[0].length;
      var j = void 0;
      while (i--) {
        j = nj;
        while (j--) {
          if (Math.abs(this.elements[i][j]) > Math.abs(m)) {
            m = this.elements[i][j];
          }
        }
      }
      return m;
    }

    // Returns the indeces of the first match found by reading row-by-row from left to right

  }, {
    key: 'indexOf',
    value: function indexOf(x) {
      var ni = this.elements.length;
      var i = void 0;
      var nj = this.elements[0].length;
      var j = void 0;
      for (i = 0; i < ni; i++) {
        for (j = 0; j < nj; j++) {
          if (this.elements[i][j] === x) {
            return {
              i: i + 1,
              j: j + 1
            };
          }
        }
      }
      return null;
    }

    // If the matrix is square, returns the diagonal elements as a vector.
    // Otherwise, returns null.

  }, {
    key: 'diagonal',
    value: function diagonal() {
      if (!this.isSquare) {
        return null;
      }
      var els = [];
      var n = this.elements.length;
      for (var i = 0; i < n; i++) {
        els.push(this.elements[i][i]);
      }
      return _vector.Vector.create(els);
    }

    // Make the matrix upper (right) triangular by Gaussian elimination.
    // This method only adds multiples of rows to other rows. No rows are
    // scaled up or switched, and the determinant is preserved.

  }, {
    key: 'toRightTriangular',
    value: function toRightTriangular() {
      var M = this.dup();
      var els = void 0;
      var n = this.elements.length;
      var i = void 0;
      var j = void 0;
      var np = this.elements[0].length;
      var p = void 0;
      for (i = 0; i < n; i++) {
        if (M.elements[i][i] === 0) {
          for (j = i + 1; j < n; j++) {
            if (M.elements[j][i] !== 0) {
              els = [];
              for (p = 0; p < np; p++) {
                els.push(M.elements[i][p] + M.elements[j][p]);
              }
              M.elements[i] = els;
              break;
            }
          }
        }
        if (M.elements[i][i] !== 0) {
          for (j = i + 1; j < n; j++) {
            var multiplier = M.elements[j][i] / M.elements[i][i];
            els = [];
            for (p = 0; p < np; p++) {
              // Elements with column numbers up to an including the number
              // of the row that we're subtracting can safely be set straight to
              // zero, since that's the point of this routine and it avoids having
              // to loop over and correct rounding errors later
              els.push(p <= i ? 0 : M.elements[j][p] - M.elements[i][p] * multiplier);
            }
            M.elements[j] = els;
          }
        }
      }
      return M;
    }
  }, {
    key: 'toUpperTriangular',
    value: function toUpperTriangular() {
      return this.toRightTriangular();
    }

    // Returns the determinant for square matrices

  }, {
    key: 'determinant',
    value: function determinant() {
      if (!this.isSquare()) {
        return null;
      }
      if (this.cols === 1 && this.rows === 1) {
        return this.row(1);
      }
      if (this.cols === 0 && this.rows === 0) {
        return 1;
      }
      var M = this.toRightTriangular();
      var det = M.elements[0][0];
      var n = M.elements.length;
      for (var i = 1; i < n; i++) {
        det *= M.elements[i][i];
      }
      return det;
    }
  }, {
    key: 'det',
    value: function det() {
      return this.determinant();
    }

    // Returns true iff the matrix is singular

  }, {
    key: 'isSingular',
    value: function isSingular() {
      return this.isSquare() && this.determinant() === 0;
    }

    // Returns the trace for square matrices

  }, {
    key: 'trace',
    value: function trace() {
      if (!this.isSquare()) {
        return null;
      }
      var tr = this.elements[0][0];
      var n = this.elements.length;
      for (var i = 1; i < n; i++) {
        tr += this.elements[i][i];
      }
      return tr;
    }
  }, {
    key: 'tr',
    value: function tr() {
      return this.trace();
    }

    // Returns the rank of the matrix

  }, {
    key: 'rank',
    value: function rank() {
      var M = this.toRightTriangular();
      var rank = 0;
      var i = this.elements.length;
      var nj = this.elements[0].length;
      var j = void 0;
      while (i--) {
        j = nj;
        while (j--) {
          if (Math.abs(M.elements[i][j]) > _sylvester.Sylvester.precision) {
            rank++;
            break;
          }
        }
      }
      return rank;
    }
  }, {
    key: 'rk',
    value: function rk() {
      return this.rank();
    }

    // Returns the result of attaching the given argument to the right-hand side of the matrix

  }, {
    key: 'augment',
    value: function augment(matrix) {
      var M = matrix.elements || matrix;
      if (typeof M[0][0] === 'undefined') {
        M = Matrix.create(M).elements;
      }
      var T = this.dup();
      var cols = T.elements[0].length;
      var i = T.elements.length;
      var nj = M[0].length;
      var j = void 0;
      if (i !== M.length) {
        return null;
      }
      while (i--) {
        j = nj;
        while (j--) {
          T.elements[i][cols + j] = M[i][j];
        }
      }
      return T;
    }

    // Returns the inverse (if one exists) using Gauss-Jordan

  }, {
    key: 'inverse',
    value: function inverse() {
      if (!this.isSquare() || this.isSingular()) {
        return null;
      }
      var n = this.elements.length;
      var i = n;
      var j = void 0;
      var M = this.augment(Matrix.I(n)).toRightTriangular();
      var np = M.elements[0].length;
      var p = void 0;
      var els = void 0;
      var divisor = void 0;

      var inverseElements = [];
      // Matrix is non-singular so there will be no zeros on the diagonal
      // Cycle through rows from last to first

      var newElement = void 0;
      while (i--) {
        // First, normalise diagonal elements to 1
        els = [];
        inverseElements[i] = [];
        divisor = M.elements[i][i];
        for (p = 0; p < np; p++) {
          newElement = M.elements[i][p] / divisor;
          els.push(newElement);
          // Shuffle off the current row of the right hand side into the results
          // array as it will not be modified by later runs through this loop
          if (p >= n) {
            inverseElements[i].push(newElement);
          }
        }
        M.elements[i] = els;
        // Then, subtract this row from those above it to
        // give the identity matrix on the left hand side
        j = i;
        while (j--) {
          els = [];
          for (p = 0; p < np; p++) {
            els.push(M.elements[j][p] - M.elements[i][p] * M.elements[j][i]);
          }
          M.elements[j] = els;
        }
      }
      return Matrix.create(inverseElements);
    }
  }, {
    key: 'inv',
    value: function inv() {
      return this.inverse();
    }

    // Returns the result of rounding all the elements

  }, {
    key: 'round',
    value: function round() {
      return this.map(function (x) {
        return Math.round(x);
      });
    }

    // Returns a copy of the matrix with elements set to the given value if they
    // differ from it by less than Sylvester.precision

  }, {
    key: 'snapTo',
    value: function snapTo(x) {
      return this.map(function (p) {
        return Math.abs(p - x) <= _sylvester.Sylvester.precision ? x : p;
      });
    }

    // Returns a string representation of the matrix

  }, {
    key: 'inspect',
    value: function inspect() {
      var matrixRows = [];
      var n = this.elements.length;
      for (var i = 0; i < n; i++) {
        matrixRows.push(_vector.Vector.create(this.elements[i]).inspect());
      }
      return matrixRows.join('\n');
    }

    // Returns a array representation of the matrix

  }, {
    key: 'toArray',
    value: function toArray() {
      var matrixRows = [];
      var n = this.elements.length;
      for (var i = 0; i < n; i++) {
        matrixRows.push(this.elements[i]);
      }
      return matrixRows;
    }

    // Set the matrix's elements from an array. If the argument passed
    // is a vector, the resulting matrix will be a single column.

  }, {
    key: 'setElements',
    value: function setElements(els) {
      var i = void 0;
      var j = void 0;
      var elements = els.elements || els;
      if (typeof elements[0][0] !== 'undefined') {
        i = elements.length;
        this.elements = [];
        while (i--) {
          j = elements[i].length;
          this.elements[i] = [];
          while (j--) {
            this.elements[i][j] = elements[i][j];
          }
        }
        return this;
      }
      var n = elements.length;
      this.elements = [];
      for (i = 0; i < n; i++) {
        this.elements.push([elements[i]]);
      }
      return this;
    }

    // return the indexes of the columns with the largest value
    // for each row

  }, {
    key: 'maxColumnIndexes',
    value: function maxColumnIndexes() {
      var maxes = [];

      for (var i = 1; i <= this.rows(); i++) {
        var max = null;
        var maxIndex = -1;

        for (var j = 1; j <= this.cols(); j++) {
          if (max === null || this.e(i, j) > max) {
            max = this.e(i, j);
            maxIndex = j;
          }
        }

        maxes.push(maxIndex);
      }

      return _vector.Vector.create(maxes);
    }

    // return the largest values in each row

  }, {
    key: 'maxColumns',
    value: function maxColumns() {
      var maxes = [];

      for (var i = 1; i <= this.rows(); i++) {
        var max = null;

        for (var j = 1; j <= this.cols(); j++) {
          if (max === null || this.e(i, j) > max) {
            max = this.e(i, j);
          }
        }

        maxes.push(max);
      }

      return _vector.Vector.create(maxes);
    }

    // return the indexes of the columns with the smallest values
    // for each row

  }, {
    key: 'minColumnIndexes',
    value: function minColumnIndexes() {
      var mins = [];

      for (var i = 1; i <= this.rows(); i++) {
        var min = null;
        var minIndex = -1;

        for (var j = 1; j <= this.cols(); j++) {
          if (min === null || this.e(i, j) < min) {
            min = this.e(i, j);
            minIndex = j;
          }
        }

        mins.push(minIndex);
      }

      return _vector.Vector.create(mins);
    }

    // return the smallest values in each row

  }, {
    key: 'minColumns',
    value: function minColumns() {
      var mins = [];

      for (var i = 1; i <= this.rows(); i++) {
        var min = null;

        for (var j = 1; j <= this.cols(); j++) {
          if (min === null || this.e(i, j) < min) {
            min = this.e(i, j);
          }
        }

        mins.push(min);
      }

      return _vector.Vector.create(mins);
    }

    // perorm a partial pivot on the matrix. essentially move the largest
    // row below-or-including the pivot and replace the pivot's row with it.
    // a pivot matrix is returned so multiplication can perform the transform.

  }, {
    key: 'partialPivot',
    value: function partialPivot(k, j, P, A) {
      var maxIndex = 0;
      var maxValue = 0;

      for (var i = k; i <= A.rows(); i++) {
        if (Math.abs(A.e(i, j)) > maxValue) {
          maxValue = Math.abs(A.e(k, j));
          maxIndex = i;
        }
      }

      if (maxIndex !== k) {
        var tmp = A.elements[k - 1];
        A.elements[k - 1] = A.elements[maxIndex - 1];
        A.elements[maxIndex - 1] = tmp;

        P.elements[k - 1][k - 1] = 0;
        P.elements[k - 1][maxIndex - 1] = 1;
        P.elements[maxIndex - 1][maxIndex - 1] = 0;
        P.elements[maxIndex - 1][k - 1] = 1;
      }

      return P;
    }

    // solve lower-triangular matrix * x = b via forward substitution

  }, {
    key: 'forwardSubstitute',
    value: function forwardSubstitute(b) {
      var xa = [];

      for (var i = 1; i <= this.rows(); i++) {
        var w = 0;

        for (var j = 1; j < i; j++) {
          w += this.e(i, j) * xa[j - 1];
        }

        xa.push((b.e(i) - w) / this.e(i, i));
      }

      return _vector.Vector.create(xa);
    }

    // solve an upper-triangular matrix * x = b via back substitution

  }, {
    key: 'backSubstitute',
    value: function backSubstitute(b) {
      var xa = [];

      for (var i = this.rows(); i > 0; i--) {
        var w = 0;

        for (var j = this.cols(); j > i; j--) {
          w += this.e(i, j) * xa[this.rows() - j];
        }

        xa.push((b.e(i) - w) / this.e(i, i));
      }

      return _vector.Vector.create(xa.reverse());
    }
  }, {
    key: 'svdJs',
    value: function svdJs() {
      var A = this;
      var V = Matrix.I(A.rows());
      var S = A.transpose();
      var U = Matrix.I(A.cols());
      var err = Number.MAX_VALUE;
      var i = 0;
      var maxLoop = 100;

      while (err > 2.2737e-13 && i < maxLoop) {
        var qr = S.transpose().qrJs();
        S = qr.R;
        V = V.x(qr.Q);
        qr = S.transpose().qrJs();
        U = U.x(qr.Q);
        S = qr.R;

        var e = S.triu(1).unroll().norm();
        var f = S.diagonal().norm();

        if (f === 0) {
          f = 1;
        }

        err = e / f;

        i++;
      }

      var ss = S.diagonal();
      var s = [];

      for (var _i2 = 1; _i2 <= ss.cols(); _i2++) {
        var ssn = ss.e(_i2);
        s.push(Math.abs(ssn));

        if (ssn < 0) {
          for (var j = 0; j < U.rows(); j++) {
            V.elements[j][_i2 - 1] = -V.elements[j][_i2 - 1];
          }
        }
      }

      return {
        U: U,
        S: _vector.Vector.create(s).toDiagonalMatrix(),
        V: V
      };
    }

    // QR decomposition in pure javascript

  }, {
    key: 'qrJs',
    value: function qrJs() {
      var m = this.rows();
      var n = this.cols();
      var Q = Matrix.I(m);
      var A = this;

      for (var k = 1; k < Math.min(m, n); k++) {
        var ak = A.slice(k, 0, k, k).col(1);
        var oneZero = [1];

        while (oneZero.length <= m - k) {
          oneZero.push(0);
        }

        oneZero = _vector.Vector.create(oneZero);
        var vk = ak.add(oneZero.x(ak.norm() * sign(ak.e(1))));
        var Vk = Matrix.create(vk);
        var Hk = Matrix.I(m - k + 1).subtract(Vk.x(2).x(Vk.transpose()).div(Vk.transpose().x(Vk).e(1, 1)));
        var Qk = identSize(Hk, m, n, k);
        A = Qk.x(A);
        // slow way to compute Q
        Q = Q.x(Qk);
      }

      return {
        Q: Q,
        R: A
      };
    }

    // pure Javascript LU factorization

  }, {
    key: 'luJs',
    value: function luJs() {
      var A = this.dup();
      var L = Matrix.I(A.rows());
      var P = Matrix.I(A.rows());
      var U = Matrix.Zeros(A.rows(), A.cols());
      var p = 1;

      for (var k = 1; k <= Math.min(A.cols(), A.rows()); k++) {
        P = A.partialPivot(k, p, P, A, L);

        for (var i = k + 1; i <= A.rows(); i++) {
          var l = A.e(i, p) / A.e(k, p);
          L.elements[i - 1][k - 1] = l;

          for (var j = k + 1; j <= A.cols(); j++) {
            A.elements[i - 1][j - 1] -= A.e(k, j) * l;
          }
        }

        for (var _j = k; _j <= A.cols(); _j++) {
          U.elements[k - 1][_j - 1] = A.e(k, _j);
        }

        if (p < A.cols()) {
          p++;
        }
      }

      return {
        L: L,
        U: U,
        P: P
      };
    }

    // Constructor function

  }], [{
    key: 'create',
    value: function create(aElements) {
      var M = new Matrix().setElements(aElements);
      return M;
    }

    // Identity matrix of size n

  }, {
    key: 'I',
    value: function I(n) {
      var els = [];
      var i = n;
      var j = void 0;
      while (i--) {
        j = n;
        els[i] = [];
        while (j--) {
          els[i][j] = i === j ? 1 : 0;
        }
      }
      return Matrix.create(els);
    }
  }, {
    key: 'loadFile',
    value: function loadFile(file) {
      var contents = fs.readFileSync(file, 'utf-8');
      var matrix = [];

      var rowArray = contents.split('\n');
      for (var i = 0; i < rowArray.length; i++) {
        var d = rowArray[i].split(',');
        if (d.length > 1) {
          matrix.push(d);
        }
      }

      var M = new Matrix();
      return M.setElements(matrix);
    }

    // Diagonal matrix - all off-diagonal elements are zero

  }, {
    key: 'Diagonal',
    value: function Diagonal(elements) {
      var i = elements.length;
      var M = Matrix.I(i);
      while (i--) {
        M.elements[i][i] = elements[i];
      }
      return M;
    }

    // Rotation matrix about some axis. If no axis is
    // supplied, assume we're after a 2D transform

  }, {
    key: 'Rotation',
    value: function Rotation(theta, a) {
      if (!a) {
        return Matrix.create([[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]);
      }
      var axis = a.dup();
      if (axis.elements.length !== 3) {
        return null;
      }
      var mod = axis.modulus();
      var x = axis.elements[0] / mod;
      var y = axis.elements[1] / mod;
      var z = axis.elements[2] / mod;

      var s = Math.sin(theta);
      // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
      // That proof rotates the co-ordinate system so theta
      // becomes -theta and sin becomes -sin here.

      var c = Math.cos(theta);
      var t = 1 - c;
      return Matrix.create([[t * x * x + c, t * x * y - s * z, t * x * z + s * y], [t * x * y + s * z, t * y * y + c, t * y * z - s * x], [t * x * z - s * y, t * y * z + s * x, t * z * z + c]]);
    }

    // Special case rotations

  }, {
    key: 'RotationX',
    value: function RotationX(t) {
      var c = Math.cos(t);
      var s = Math.sin(t);
      return Matrix.create([[1, 0, 0], [0, c, -s], [0, s, c]]);
    }
  }, {
    key: 'RotationY',
    value: function RotationY(t) {
      var c = Math.cos(t);
      var s = Math.sin(t);
      return Matrix.create([[c, 0, s], [0, 1, 0], [-s, 0, c]]);
    }
  }, {
    key: 'RotationZ',
    value: function RotationZ(t) {
      var c = Math.cos(t);
      var s = Math.sin(t);
      return Matrix.create([[c, -s, 0], [s, c, 0], [0, 0, 1]]);
    }

    // Random matrix of n rows, m columns

  }, {
    key: 'Random',
    value: function Random(n, m) {
      if (arguments.length === 1) {
        m = n;
      }
      return Matrix.Zero(n, m).map(function () {
        return Math.random();
      });
    }
  }, {
    key: 'Fill',
    value: function Fill(n, m, v) {
      if (arguments.length === 2) {
        v = m;
        m = n;
      }

      var els = [];
      var i = n;
      var j = void 0;

      while (i--) {
        j = m;
        els[i] = [];

        while (j--) {
          els[i][j] = v;
        }
      }

      return Matrix.create(els);
    }

    // Matrix filled with zeros

  }, {
    key: 'Zero',
    value: function Zero(n, m) {
      return Matrix.Fill(n, m, 0);
    }

    // Matrix filled with zeros

  }, {
    key: 'Zeros',
    value: function Zeros(n, m) {
      return Matrix.Zero(n, m);
    }

    // Matrix filled with ones

  }, {
    key: 'One',
    value: function One(n, m) {
      return Matrix.Fill(n, m, 1);
    }

    // Matrix filled with ones

  }, {
    key: 'Ones',
    value: function Ones(n, m) {
      return Matrix.One(n, m);
    }
  }]);

  return Matrix;
}();

// otherwise use the slower pure Javascript versions


Matrix.prototype.svd = Matrix.prototype.svdJs;
Matrix.prototype.qr = Matrix.prototype.qrJs;
Matrix.prototype.lu = Matrix.prototype.luJs;