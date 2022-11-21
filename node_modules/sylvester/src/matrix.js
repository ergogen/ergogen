import * as fs from 'fs';
import { Sylvester } from './sylvester';
import { Vector } from './vector';

function sign(x) {
  return x < 0 ? -1 : 1;
}

// augment a matrix M with identity rows/cols
function identSize(M, m, n, k) {
  const e = M.elements;
  let i = k - 1;

  while (i--) {
    const row = [];

    for (let j = 0; j < n; j++) {
      row.push(j === i ? 1 : 0);
    }

    e.unshift(row);
  }

  for (let i = k - 1; i < m; i++) {
    while (e[i].length < n) {
      e[i].unshift(0);
    }
  }

  return Matrix.create(e); // eslint-disable-line no-use-before-define
}

function pca(X) {
  const Sigma = X.transpose().x(X).x(1 / X.rows());
  const svd = Sigma.svd();
  return {
    U: svd.U,
    S: svd.S
  };
}

export class Matrix {
  // solve a system of linear equations (work in progress)
  solve(b) {
    const lu = this.lu();
    b = lu.P.x(b);
    const y = lu.L.forwardSubstitute(b);
    const x = lu.U.backSubstitute(y);
    return lu.P.x(x);
        // return this.inv().x(b);
  }

  // project a matrix onto a lower dim

  pcaProject(k, U = pca(this).U) {
    const Ureduce = U.slice(1, U.rows(), 1, k);
    return {
      Z: this.x(Ureduce),
      U
    };
  }

  // recover a matrix to a higher dimension

  pcaRecover(U) {
    const k = this.cols();
    const Ureduce = U.slice(1, U.rows(), 1, k);
    return this.x(Ureduce.transpose());
  }

  // grab the upper triangular part of the matrix

  triu(k) {
    if (!k) {
      k = 0;
    }

    return this.map((x, i, j) => {
      return j - i >= k ? x : 0;
    });
  }

  // unroll a matrix into a vector

  unroll() {
    const v = [];

    for (let i = 1; i <= this.cols(); i++) {
      for (let j = 1; j <= this.rows(); j++) {
        v.push(this.e(j, i));
      }
    }

    return Vector.create(v);
  }

  // return a sub-block of the matrix

  slice(startRow, endRow, startCol, endCol) {
    const x = [];

    if (endRow === 0) {
      endRow = this.rows();
    }

    if (endCol === 0) {
      endCol = this.cols();
    }

    for (let i = startRow; i <= endRow; i++) {
      const row = [];

      for (let j = startCol; j <= endCol; j++) {
        row.push(this.e(i, j));
      }

      x.push(row);
    }

    return Matrix.create(x);
  }

  // Returns element (i,j) of the matrix

  e(i, j) {
    if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) {
      return null;
    }
    return this.elements[i - 1][j - 1];
  }

  // Returns row k of the matrix as a vector

  row(i) {
    if (i > this.elements.length) {
      return null;
    }
    return Vector.create(this.elements[i - 1]);
  }

  // Returns column k of the matrix as a vector

  col(j) {
    if (j > this.elements[0].length) {
      return null;
    }
    const col = [];
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      col.push(this.elements[i][j - 1]);
    }
    return Vector.create(col);
  }

  // Returns the number of rows/columns the matrix has

  dimensions() {
    return {
      rows: this.elements.length,
      cols: this.elements[0].length
    };
  }

  // Returns the number of rows in the matrix

  rows() {
    return this.elements.length;
  }

  // Returns the number of columns in the matrix

  cols() {
    return this.elements[0].length;
  }

  approxEql(matrix) {
    return this.eql(matrix, Sylvester.approxPrecision);
  }

  // Returns true iff the matrix is equal to the argument. You can supply
  // a vector as the argument, in which case the receiver must be a
  // one-column matrix equal to the vector.

  eql(matrix, precision) {
    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    if (this.elements.length !== M.length || this.elements[0].length !== M[0].length) {
      return false;
    }
    let i = this.elements.length;
    const nj = this.elements[0].length;
    let j;
    while (i--) {
      j = nj;
      while (j--) {
        if (Math.abs(this.elements[i][j] - M[i][j]) > (precision || Sylvester.precision)) {
          return false;
        }
      }
    }
    return true;
  }

  // Returns a copy of the matrix

  dup() {
    return Matrix.create(this.elements);
  }

  // Maps the matrix to another matrix (of the same dimensions) according to the given function

  map(fn) {
    const els = [];
    let i = this.elements.length;
    const nj = this.elements[0].length;
    let j;
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

  isSameSizeAs(matrix) {
    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    return (this.elements.length === M.length && this.elements[0].length === M[0].length);
  }

  // Returns the result of adding the argument to the matrix

  add(matrix) {
    if (typeof (matrix) === 'number') {
      return this.map(x => x + matrix);
    }

    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    if (!this.isSameSizeAs(M)) {
      return null;
    }
    return this.map((x, i, j) => x + M[i - 1][j - 1]);
  }

  // Returns the result of subtracting the argument from the matrix

  subtract(matrix) {
    if (typeof (matrix) === 'number') {
      return this.map(x => x - matrix);
    }

    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    if (!this.isSameSizeAs(M)) {
      return null;
    }
    return this.map((x, i, j) => x - M[i - 1][j - 1]);
  }

  // Returns true iff the matrix can multiply the argument from the left

  canMultiplyFromLeft(matrix) {
    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
        // this.columns should equal matrix.rows
    return (this.elements[0].length === M.length);
  }

  // Returns the result of a multiplication-style operation the matrix from the right by the argument.
  // If the argument is a scalar then just operate on all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.

  mulOp(matrix, op) {
    if (!matrix.elements) {
      return this.map(x => {
        return op(x, matrix);
      });
    }

    const returnVector = Boolean(matrix.modulus);
    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    if (!this.canMultiplyFromLeft(M)) {
      return null;
    }
    const e = this.elements;
    let rowThis;
    let rowElem;
    const elements = [];
    let sum;
    const m = e.length;
    const n = M[0].length;
    const o = e[0].length;
    let i = m;
    let j;
    let k;

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

    const output = Matrix.create(elements);
    return returnVector ? output.col(1) : output;
  }

  // Returns the result of dividing the matrix from the right by the argument.
  // If the argument is a scalar then just divide all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.

  div(matrix) {
    return this.mulOp(matrix, (x, y) => {
      return x / y;
    });
  }

  // Returns the result of multiplying the matrix from the right by the argument.
  // If the argument is a scalar then just multiply all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.

  multiply(matrix) {
    return this.mulOp(matrix, (x, y) => {
      return x * y;
    });
  }

  x(matrix) {
    return this.multiply(matrix);
  }

  elementMultiply(v) {
    return this.map((k, i, j) => {
      return v.e(i, j) * k;
    });
  }

  // sum all elements in the matrix

  sum() {
    let sum = 0;
    this.map(x => { // eslint-disable-line array-callback-return
      sum += x;
    });
    return sum;
  }

  // Returns a Vector of each colum averaged.

  mean() {
    const dim = this.dimensions();
    const r = [];
    for (let i = 1; i <= dim.cols; i++) {
      r.push(this.col(i).sum() / dim.rows);
    }
    return Vector.create(r);
  }

  // Returns a Vector of each column's standard deviation

  std() {
    const dim = this.dimensions();
    const mMean = this.mean();
    const r = [];
    for (let i = 1; i <= dim.cols; i++) {
      let meanDiff = this.col(i).subtract(mMean.e(i));
      meanDiff = meanDiff.multiply(meanDiff);
      r.push(Math.sqrt(meanDiff.sum() / dim.rows));
    }
    return Vector.create(r);
  }

  column(n) {
    return this.col(n);
  }

  // element-wise log

  log() {
    return this.map(x => {
      return Math.log(x);
    });
  }

  // Returns a submatrix taken from the matrix
  // Argument order is: start row, start col, nrows, ncols
  // Element selection wraps if the required index is outside the matrix's bounds, so you could
  // use this to perform row/column cycling or copy-augmenting.

  minor(a, b, c, d) {
    const elements = [];
    let ni = c;
    let i;
    let nj;
    let j;
    const rows = this.elements.length;
    const cols = this.elements[0].length;
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

  transpose() {
    const rows = this.elements.length;
    const cols = this.elements[0].length;
    const elements = [];
    let i = cols;
    let j;
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

  isSquare() {
    return (this.elements.length === this.elements[0].length);
  }

  // Returns the (absolute) largest element of the matrix

  max() {
    let m = 0;
    let i = this.elements.length;
    const nj = this.elements[0].length;
    let j;
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

  indexOf(x) {
    const ni = this.elements.length;
    let i;
    const nj = this.elements[0].length;
    let j;
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

  diagonal() {
    if (!this.isSquare) {
      return null;
    }
    const els = [];
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      els.push(this.elements[i][i]);
    }
    return Vector.create(els);
  }

  // Make the matrix upper (right) triangular by Gaussian elimination.
  // This method only adds multiples of rows to other rows. No rows are
  // scaled up or switched, and the determinant is preserved.

  toRightTriangular() {
    const M = this.dup();
    let els;
    const n = this.elements.length;
    let i;
    let j;
    const np = this.elements[0].length;
    let p;
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
          const multiplier = M.elements[j][i] / M.elements[i][i];
          els = [];
          for (p = 0; p < np; p++) {
            // Elements with column numbers up to an including the number
            // of the row that we're subtracting can safely be set straight to
            // zero, since that's the point of this routine and it avoids having
            // to loop over and correct rounding errors later
            els.push(p <= i ? 0 : M.elements[j][p] - (M.elements[i][p] * multiplier));
          }
          M.elements[j] = els;
        }
      }
    }
    return M;
  }

  toUpperTriangular() {
    return this.toRightTriangular();
  }

  // Returns the determinant for square matrices

  determinant() {
    if (!this.isSquare()) {
      return null;
    }
    if (this.cols === 1 && this.rows === 1) {
      return this.row(1);
    }
    if (this.cols === 0 && this.rows === 0) {
      return 1;
    }
    const M = this.toRightTriangular();
    let det = M.elements[0][0];
    const n = M.elements.length;
    for (let i = 1; i < n; i++) {
      det *= M.elements[i][i];
    }
    return det;
  }

  det() {
    return this.determinant();
  }

  // Returns true iff the matrix is singular

  isSingular() {
    return (this.isSquare() && this.determinant() === 0);
  }

  // Returns the trace for square matrices

  trace() {
    if (!this.isSquare()) {
      return null;
    }
    let tr = this.elements[0][0];
    const n = this.elements.length;
    for (let i = 1; i < n; i++) {
      tr += this.elements[i][i];
    }
    return tr;
  }

  tr() {
    return this.trace();
  }

  // Returns the rank of the matrix

  rank() {
    const M = this.toRightTriangular();
    let rank = 0;
    let i = this.elements.length;
    const nj = this.elements[0].length;
    let j;
    while (i--) {
      j = nj;
      while (j--) {
        if (Math.abs(M.elements[i][j]) > Sylvester.precision) {
          rank++;
          break;
        }
      }
    }
    return rank;
  }

  rk() {
    return this.rank();
  }

  // Returns the result of attaching the given argument to the right-hand side of the matrix

  augment(matrix) {
    let M = matrix.elements || matrix;
    if (typeof (M[0][0]) === 'undefined') {
      M = Matrix.create(M).elements;
    }
    const T = this.dup();
    const cols = T.elements[0].length;
    let i = T.elements.length;
    const nj = M[0].length;
    let j;
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

  inverse() {
    if (!this.isSquare() || this.isSingular()) {
      return null;
    }
    const n = this.elements.length;
    let i = n;
    let j;
    const M = this.augment(Matrix.I(n)).toRightTriangular();
    const np = M.elements[0].length;
    let p;
    let els;
    let divisor;

    const inverseElements = [];
    // Matrix is non-singular so there will be no zeros on the diagonal
    // Cycle through rows from last to first

    let newElement;
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
          els.push(M.elements[j][p] - (M.elements[i][p] * M.elements[j][i]));
        }
        M.elements[j] = els;
      }
    }
    return Matrix.create(inverseElements);
  }

  inv() {
    return this.inverse();
  }

  // Returns the result of rounding all the elements

  round() {
    return this.map(x => {
      return Math.round(x);
    });
  }

  // Returns a copy of the matrix with elements set to the given value if they
  // differ from it by less than Sylvester.precision

  snapTo(x) {
    return this.map(p => {
      return (Math.abs(p - x) <= Sylvester.precision) ? x : p;
    });
  }

  // Returns a string representation of the matrix

  inspect() {
    const matrixRows = [];
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      matrixRows.push(Vector.create(this.elements[i]).inspect());
    }
    return matrixRows.join('\n');
  }

  // Returns a array representation of the matrix

  toArray() {
    const matrixRows = [];
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      matrixRows.push(this.elements[i]);
    }
    return matrixRows;
  }

  // Set the matrix's elements from an array. If the argument passed
  // is a vector, the resulting matrix will be a single column.

  setElements(els) {
    let i;
    let j;
    const elements = els.elements || els;
    if (typeof (elements[0][0]) !== 'undefined') {
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
    const n = elements.length;
    this.elements = [];
    for (i = 0; i < n; i++) {
      this.elements.push([elements[i]]);
    }
    return this;
  }

  // return the indexes of the columns with the largest value
  // for each row

  maxColumnIndexes() {
    const maxes = [];

    for (let i = 1; i <= this.rows(); i++) {
      let max = null;
      let maxIndex = -1;

      for (let j = 1; j <= this.cols(); j++) {
        if (max === null || this.e(i, j) > max) {
          max = this.e(i, j);
          maxIndex = j;
        }
      }

      maxes.push(maxIndex);
    }

    return Vector.create(maxes);
  }

  // return the largest values in each row

  maxColumns() {
    const maxes = [];

    for (let i = 1; i <= this.rows(); i++) {
      let max = null;

      for (let j = 1; j <= this.cols(); j++) {
        if (max === null || this.e(i, j) > max) {
          max = this.e(i, j);
        }
      }

      maxes.push(max);
    }

    return Vector.create(maxes);
  }

  // return the indexes of the columns with the smallest values
  // for each row

  minColumnIndexes() {
    const mins = [];

    for (let i = 1; i <= this.rows(); i++) {
      let min = null;
      let minIndex = -1;

      for (let j = 1; j <= this.cols(); j++) {
        if (min === null || this.e(i, j) < min) {
          min = this.e(i, j);
          minIndex = j;
        }
      }

      mins.push(minIndex);
    }

    return Vector.create(mins);
  }

  // return the smallest values in each row

  minColumns() {
    const mins = [];

    for (let i = 1; i <= this.rows(); i++) {
      let min = null;

      for (let j = 1; j <= this.cols(); j++) {
        if (min === null || this.e(i, j) < min) {
          min = this.e(i, j);
        }
      }

      mins.push(min);
    }

    return Vector.create(mins);
  }

  // perorm a partial pivot on the matrix. essentially move the largest
  // row below-or-including the pivot and replace the pivot's row with it.
  // a pivot matrix is returned so multiplication can perform the transform.
  partialPivot(k, j, P, A) {
    let maxIndex = 0;
    let maxValue = 0;

    for (let i = k; i <= A.rows(); i++) {
      if (Math.abs(A.e(i, j)) > maxValue) {
        maxValue = Math.abs(A.e(k, j));
        maxIndex = i;
      }
    }

    if (maxIndex !== k) {
      const tmp = A.elements[k - 1];
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

  forwardSubstitute(b) {
    const xa = [];

    for (let i = 1; i <= this.rows(); i++) {
      let w = 0;

      for (let j = 1; j < i; j++) {
        w += this.e(i, j) * xa[j - 1];
      }

      xa.push((b.e(i) - w) / this.e(i, i));
    }

    return Vector.create(xa);
  }

  // solve an upper-triangular matrix * x = b via back substitution

  backSubstitute(b) {
    const xa = [];

    for (let i = this.rows(); i > 0; i--) {
      let w = 0;

      for (let j = this.cols(); j > i; j--) {
        w += this.e(i, j) * xa[this.rows() - j];
      }

      xa.push((b.e(i) - w) / this.e(i, i));
    }

    return Vector.create(xa.reverse());
  }

  svdJs() {
    const A = this;
    let V = Matrix.I(A.rows());
    let S = A.transpose();
    let U = Matrix.I(A.cols());
    let err = Number.MAX_VALUE;
    let i = 0;
    const maxLoop = 100;

    while (err > 2.2737e-13 && i < maxLoop) {
      let qr = S.transpose().qrJs();
      S = qr.R;
      V = V.x(qr.Q);
      qr = S.transpose().qrJs();
      U = U.x(qr.Q);
      S = qr.R;

      const e = S.triu(1).unroll().norm();
      let f = S.diagonal().norm();

      if (f === 0) {
        f = 1;
      }

      err = e / f;

      i++;
    }

    const ss = S.diagonal();
    const s = [];

    for (let i = 1; i <= ss.cols(); i++) {
      const ssn = ss.e(i);
      s.push(Math.abs(ssn));

      if (ssn < 0) {
        for (let j = 0; j < U.rows(); j++) {
          V.elements[j][i - 1] = -(V.elements[j][i - 1]);
        }
      }
    }

    return {
      U,
      S: Vector.create(s).toDiagonalMatrix(),
      V
    };
  }

  // QR decomposition in pure javascript
  qrJs() {
    const m = this.rows();
    const n = this.cols();
    let Q = Matrix.I(m);
    let A = this;

    for (let k = 1; k < Math.min(m, n); k++) {
      const ak = A.slice(k, 0, k, k).col(1);
      let oneZero = [1];

      while (oneZero.length <= m - k) {
        oneZero.push(0);
      }

      oneZero = Vector.create(oneZero);
      const vk = ak.add(oneZero.x(ak.norm() * sign(ak.e(1))));
      const Vk = Matrix.create(vk);
      const Hk = Matrix.I(m - k + 1).subtract(Vk.x(2).x(Vk.transpose()).div(Vk.transpose().x(Vk).e(1, 1)));
      const Qk = identSize(Hk, m, n, k);
      A = Qk.x(A);
          // slow way to compute Q
      Q = Q.x(Qk);
    }

    return {
      Q,
      R: A
    };
  }

  // pure Javascript LU factorization
  luJs() {
    const A = this.dup();
    const L = Matrix.I(A.rows());
    let P = Matrix.I(A.rows());
    const U = Matrix.Zeros(A.rows(), A.cols());
    let p = 1;

    for (let k = 1; k <= Math.min(A.cols(), A.rows()); k++) {
      P = A.partialPivot(k, p, P, A, L);

      for (let i = k + 1; i <= A.rows(); i++) {
        const l = A.e(i, p) / A.e(k, p);
        L.elements[i - 1][k - 1] = l;

        for (let j = k + 1; j <= A.cols(); j++) {
          A.elements[i - 1][j - 1] -= A.e(k, j) * l;
        }
      }

      for (let j = k; j <= A.cols(); j++) {
        U.elements[k - 1][j - 1] = A.e(k, j);
      }

      if (p < A.cols()) {
        p++;
      }
    }

    return {
      L,
      U,
      P
    };
  }

  // Constructor function
  static create(aElements) {
    const M = new Matrix().setElements(aElements);
    return M;
  }

  // Identity matrix of size n
  static I(n) {
    const els = [];
    let i = n;
    let j;
    while (i--) {
      j = n;
      els[i] = [];
      while (j--) {
        els[i][j] = (i === j) ? 1 : 0;
      }
    }
    return Matrix.create(els);
  }

  static loadFile(file) {
    const contents = fs.readFileSync(file, 'utf-8');
    const matrix = [];

    const rowArray = contents.split('\n');
    for (let i = 0; i < rowArray.length; i++) {
      const d = rowArray[i].split(',');
      if (d.length > 1) {
        matrix.push(d);
      }
    }

    const M = new Matrix();
    return M.setElements(matrix);
  }

  // Diagonal matrix - all off-diagonal elements are zero
  static Diagonal(elements) {
    let i = elements.length;
    const M = Matrix.I(i);
    while (i--) {
      M.elements[i][i] = elements[i];
    }
    return M;
  }

  // Rotation matrix about some axis. If no axis is
  // supplied, assume we're after a 2D transform
  static Rotation(theta, a) {
    if (!a) {
      return Matrix.create([[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]]);
    }
    const axis = a.dup();
    if (axis.elements.length !== 3) {
      return null;
    }
    const mod = axis.modulus();
    const x = axis.elements[0] / mod;
    const y = axis.elements[1] / mod;
    const z = axis.elements[2] / mod;

    const s = Math.sin(theta);
    // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
    // That proof rotates the co-ordinate system so theta
    // becomes -theta and sin becomes -sin here.

    const c = Math.cos(theta);
    const t = 1 - c;
    return Matrix.create([
      [
        (t * x * x) + c,
        (t * x * y) - (s * z),
        (t * x * z) + (s * y)
      ],
      [
        (t * x * y) + (s * z),
        (t * y * y) + c,
        (t * y * z) - (s * x)
      ],
      [
        (t * x * z) - (s * y),
        (t * y * z) + (s * x),
        (t * z * z) + c
      ]
    ]);
  }

  // Special case rotations
  static RotationX(t) {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return Matrix.create([[1, 0, 0], [0, c, -s], [0, s, c]]);
  }

  static RotationY(t) {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return Matrix.create([[c, 0, s], [0, 1, 0], [-s, 0, c]]);
  }

  static RotationZ(t) {
    const c = Math.cos(t);
    const s = Math.sin(t);
    return Matrix.create([[c, -s, 0], [s, c, 0], [0, 0, 1]]);
  }

  // Random matrix of n rows, m columns
  static Random(n, m) {
    if (arguments.length === 1) {
      m = n;
    }
    return Matrix.Zero(n, m).map(() => {
      return Math.random();
    });
  }

  static Fill(n, m, v) {
    if (arguments.length === 2) {
      v = m;
      m = n;
    }

    const els = [];
    let i = n;
    let j;

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
  static Zero(n, m) {
    return Matrix.Fill(n, m, 0);
  }

  // Matrix filled with zeros
  static Zeros(n, m) {
    return Matrix.Zero(n, m);
  }

  // Matrix filled with ones
  static One(n, m) {
    return Matrix.Fill(n, m, 1);
  }

  // Matrix filled with ones
  static Ones(n, m) {
    return Matrix.One(n, m);
  }
}


// otherwise use the slower pure Javascript versions
Matrix.prototype.svd = Matrix.prototype.svdJs;
Matrix.prototype.qr = Matrix.prototype.qrJs;
Matrix.prototype.lu = Matrix.prototype.luJs;
