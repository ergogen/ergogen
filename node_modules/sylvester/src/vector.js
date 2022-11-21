import { DimensionalityMismatchError, Sylvester } from './sylvester';
import { Matrix } from './matrix';

/**
 * The Vector class is designed to model vectors in any number of dimensions.
 * All the elements of a vector must be real numbers. Depending on what you’re
 * using them for, it can be helpful to think of a vector either as a point
 * in n-dimensional space, or as a line connecting
 * the origin to that same point.
 */
export class Vector {

  /**
   * Creates a new vector, initializing it with the provided elements.
   * @param  {Number[]} elements
   */
  constructor(elements) {
    this.elements = elements;
  }

  /**
   * Returns the magnitude (also: euclidean norm, magnitude) of the vector.
   *
   * $example Vector.magnitude
   * @see https://en.wikipedia.org/wiki/Euclidean_distance
   * @return {Number}
   */
  magnitude() {
    let sum = 0;
    for (let i = 0; i < this.elements.length; i++) {
      sum += this.elements[i] * this.elements[i];
    }

    return Math.sqrt(sum);
  }

  /**
   * Returns the `ith` element if the vector. Returns null if `i` is out
   * of bounds, indexing starts from 1.
   *
   * $example Vector.e
   * @param  {Number} i
   * @return {Number}
   */
  e(i) {
    return (i < 1 || i > this.elements.length) ? null : this.elements[i - 1];
  }

  /**
   * Returns the number of rows and columns the vector has.
   *
   * $example Vector.dimensions
   * @return {IDimensions} the "rows" will always equal zero
   */
  dimensions() {
    return {
      rows: 1,
      cols: this.elements.length
    };
  }

  /**
   * Returns the number of rows the vector has.
   *
   * $example Vector.rows
   * @return {Number} always `1`
   */
  rows() {
    return 1;
  }

  /**
   * Returns the number of columns the vector has.
   *
   * $example Vector.cols
   * @return {Number}
   */
  cols() {
    return this.elements.length;
  }

  /**
   * Returns if the Vector is equal to the input vector.
   * $example Vector.eql
   * @param  {Vector} vector
   * @return {Boolean}
   */
  eql(vector) {
    let n = this.elements.length;
    const V = vector.elements || vector;
    if (n !== V.length) {
      return false;
    }
    while (n--) {
      if (Math.abs(this.elements[n] - V[n]) > Sylvester.precision) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns a new function created by calling the iterator on all values of this vector.
   * @param  {Function} fn
   * @return {Vector}
   */
  map(fn) {
    const n = this.elements.length;
    const elements = new Array(n);
    for (let i = 0; i < n; i++) {
      elements[i] = fn(this.elements[i], i + 1);
    }

    return new Vector(elements);
  }

  /**
   * Iterates through the elements of the vector
   * @param {Function} fn called with the `(element, index)`
   */
  each(fn) {
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      fn(this.elements[i], i + 1);
    }
  }

  /**
   * Returns a new vector created by normalizing this one to a have a
   * magnitude of `1`. If the vector is the zero vector, it will not be modified.
   *
   * $example Vector.toUnitVector
   * @return {Vector}
   */
  toUnitVector() {
    const r = this.modulus();
    if (r === 0) {
      return this.dup();
    }

    return this.map(x => x / r);
  }

  /**
   * Returns the angle between this vector the argument in radians. If the
   * vectors are mirrored across their axes this will return `NaN`.
   * $example Vector.angleFrom
   * @throws {DimensionalityMismatchError} If a vector is passed in with
   *     different dimensions
   * @param  {Vector} vector
   * @return {Number}
   */
  angleFrom(vector) {
    const V = vector.elements || vector;
    const n = this.elements.length;
    if (n !== V.length) {
      throw new DimensionalityMismatchError(
        'Cannot compute the angle between vectors with different dimensionality'
      );
    }

    // Work things out in parallel to save time
    let dot = 0;
    let mod1 = 0;
    let mod2 = 0;
    this.each((x, i) => {
      dot += x * V[i - 1];
      mod1 += x * x;
      mod2 += V[i - 1] * V[i - 1];
    });
    mod1 = Math.sqrt(mod1);
    mod2 = Math.sqrt(mod2);
    if (mod1 * mod2 === 0) {
      return NaN;
    }

    let theta = dot / (mod1 * mod2);
    if (theta < -1) {
      theta = -1;
    }
    if (theta > 1) {
      theta = 1;
    }
    return Math.acos(theta);
  }

  /**
   * Returns whether the vectors are parallel to each other.
   * $example Vector.isParallelTo
   * @return {Boolean}
   */
  isParallelTo(vector) {
    const angle = this.angleFrom(vector);
    return angle === null ? false : (angle <= Sylvester.precision);
  }

  /**
   * Returns whether the vectors are antiparallel to each other.
   * $example Vector.isAntiparallelTo
   * @return {Boolean}
   */
  isAntiparallelTo(vector) {
    const angle = this.angleFrom(vector);
    return angle === null ? false : (Math.abs(angle - Math.PI) <= Sylvester.precision);
  }

  /**
   * Returns whether the vectors are perpendicular to each other.
   * $example Vector.isPerpendicularTo
   * @return {Boolean}
   */
  isPerpendicularTo(vector) {
    return Math.abs(this.dot(vector)) <= Sylvester.precision;
  }

  _runBinaryOp(value, operator) {
    if (typeof value === 'number') {
      return this.map(v => operator(v, value));
    }

    const values = value.elements || value;
    if (this.elements.length !== values.length) {
      throw new DimensionalityMismatchError('Cannot add vectors with different dimensions.');
    }

    return this.map((x, i) => operator(x, values[i - 1]));
  }

  /**
   * When the input is a constant, this returns the result of adding it to
   * all cevtor elements. When it's a vector, the vectors will be added.
   * $example Vector.add
   * @throws {DimensionalityMismatchError} If a vector is passed in with
   *     different dimensions
   * @param {Number|Number[]|Vector} value
   * @return {Vector}
   */
  add(value) {
    return this._runBinaryOp(value, (a, b) => a + b);
  }

  /**
   * When the input is a constant, this returns the result of subtracting it
   * from all vector elements. When it's a vector, the vectors will be subtracted.
   * $example Vector.subtract
   * @throws {DimensionalityMismatchError} If a vector is passed in with
   *     different dimensions
   * @param {Number|Number[]|Vector} value
   * @return {Vector}
   */
  subtract(value) {
    return this._runBinaryOp(value, (a, b) => a - b);
  }

  /**
   * When the input is a constant, this returns the result of multiplying it
   * with all vector elements. When it's a vector, the vectors will be
   * element-wise multiplied.
   * $example Vector.multiply
   * @throws {DimensionalityMismatchError} If a vector is passed in with
   *     different dimensions
   * @param {Number|Number[]|Vector} value
   * @return {Vector}
   */
  multiply(value) {
    return this._runBinaryOp(value, (a, b) => a * b);
  }

  /**
   * Returns the sum of all elements in the Vector.
   * $example Vector.sum
   * @return {Number}
   */
  sum() {
    let sum = 0;
    this.each(x => {
      sum += x;
    });
    return sum;
  }

  /**
   * Returns a new vector with the first `n` elements removed from the beginning.
   * $example Vector.chomp
   * @param  {Number} n
   * @return {Vector}
   */
  chomp(n) {
    const elements = [];
    for (let i = n; i < this.elements.length; i++) {
      elements.push(this.elements[i]);
    }

    return Vector.create(elements);
  }

  /**
   * Returns a new vector consisting only of the first `n` elements.
   * $example Vector.chomp
   * @param  {Number} n
   * @return {Vector}
   */
  top(n) {
    const elements = [];
    for (let i = 0; i < n; i++) {
      elements.push(this.elements[i]);
    }

    return Vector.create(elements);
  }

  /**
   * Returns a new vector with the provided `elements` concatenated on the end.
   * $example Vector.augment
   * @param  {Number[]|Vector} elements
   * @return {Vector}
   */
  augment(elements) {
    return Vector.create(this.elements.concat(elements.elements || elements));
  }

  /**
   * @alias Vector#multiply
   */
  x(k) {
    return this.multiply(k);
  }

  log() {
    return Vector.log(this);
  }

  /**
   * Returns the product of all elements in the vector.
   * $example Vector.product
   * @return {Number}
   */
  product() {
    let p = 1;
    this.each(v => {
      p *= v;
    });

    return p;
  }

  /**
   * Returns the scalar (dot) product of the vector with the argument.
   *
   * $example Vector.dot
   * @see https://en.wikipedia.org/wiki/Scalar_product
   * @throws {DimensionalityMismatchError} If a vector is passed in with
   *     different dimensions
   * @param  {Vector|Number[]} vector
   * @return {Number}
   */
  dot(vector) {
    const V = vector.elements || vector;
    let n = this.elements.length;
    if (n !== V.length) {
      throw new DimensionalityMismatchError(
        'Cannot compute the dot product of vectors with different dimensionality'
      );
    }

    let product = 0;
    while (n--) {
      product += this.elements[n] * V[n];
    }
    return product;
  }

  // Returns the vector product of the vector with the argument
  // Both vectors must have dimensionality 3

  cross(vector) {
    const B = vector.elements || vector;
    if (this.elements.length !== 3 || B.length !== 3) {
      return null;
    }
    const A = this.elements;
    return Vector.create([
      (A[1] * B[2]) - (A[2] * B[1]),
      (A[2] * B[0]) - (A[0] * B[2]),
      (A[0] * B[1]) - (A[1] * B[0])
    ]);
  }

  // Returns the (absolute) largest element of the vector

  max() {
    let m = 0;
    let i = this.elements.length;
    while (i--) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i];
      }
    }
    return m;
  }

  maxIndex() {
    let m = 0;
    let i = this.elements.length;
    let maxIndex = -1;

    while (i--) {
      if (Math.abs(this.elements[i]) > Math.abs(m)) {
        m = this.elements[i];
        maxIndex = i + 1;
      }
    }

    return maxIndex;
  }

  // Returns the index of the first match found

  indexOf(x) {
    let index = null;
    const n = this.elements.length;
    for (let i = 0; i < n; i++) {
      if (index === null && this.elements[i] === x) {
        index = i + 1;
      }
    }
    return index;
  }

  // Returns a diagonal matrix with the vector's elements as its diagonal elements

  toDiagonalMatrix() {
    return Matrix.Diagonal(this.elements);
  }

  // Returns the result of rounding the elements of the vector

  round() {
    return this.map(x => {
      return Math.round(x);
    });
  }

  // Transpose a Vector, return a 1xn Matrix

  transpose() {
    const rows = this.elements.length;
    const elements = [];

    for (let i = 0; i < rows; i++) {
      elements.push([this.elements[i]]);
    }
    return Matrix.create(elements);
  }

  // Returns a copy of the vector with elements set to the given value if they
  // differ from it by less than Sylvester.precision

  snapTo(x) {
    return this.map(y => {
      return (Math.abs(y - x) <= Sylvester.precision) ? x : y;
    });
  }

  // Returns the vector's distance from the argument, when considered as a point in space

  distanceFrom(obj) {
    if (obj.anchor || (obj.start && obj.end)) {
      return obj.distanceFrom(this);
    }
    const V = obj.elements || obj;
    if (V.length !== this.elements.length) {
      return null;
    }
    let sum = 0;
    let part;
    this.each((x, i) => {
      part = x - V[i - 1];
      sum += part * part;
    });
    return Math.sqrt(sum);
  }

  // Returns true if the vector is point on the given line

  liesOn(line) {
    return line.contains(this);
  }

  // Return true iff the vector is a point in the given plane

  liesIn(plane) {
    return plane.contains(this);
  }

  // Rotates the vector about the given object. The object should be a
  // point if the vector is 2D, and a line if it is 3D. Be careful with line directions!

  rotate(t, obj) {
    let V;
    let R = null;
    let x;
    let y;
    let z;
    let C;
    if (t.determinant) {
      R = t.elements;
    }
    switch (this.elements.length) {
      case 2:
        V = obj.elements || obj;
        if (V.length !== 2) {
          return null;
        }
        if (!R) {
          R = Matrix.Rotation(t).elements;
        }
        x = this.elements[0] - V[0];
        y = this.elements[1] - V[1];
        return Vector.create([
          V[0] + (R[0][0] * x) + (R[0][1] * y),
          V[1] + (R[1][0] * x) + (R[1][1] * y)
        ]);
      case 3:
        if (!obj.direction) {
          return null;
        }
        C = obj.pointClosestTo(this).elements;
        if (!R) {
          R = Matrix.Rotation(t, obj.direction).elements;
        }
        x = this.elements[0] - C[0];
        y = this.elements[1] - C[1];
        z = this.elements[2] - C[2];
        return Vector.create([
          C[0] + (R[0][0] * x) + (R[0][1] * y) + (R[0][2] * z),
          C[1] + (R[1][0] * x) + (R[1][1] * y) + (R[1][2] * z),
          C[2] + (R[2][0] * x) + (R[2][1] * y) + (R[2][2] * z)
        ]);
      default:
        return null;
    }
  }

  // Returns the result of reflecting the point in the given point, line or plane

  reflectionIn(obj) {
    if (obj.anchor) {
      // obj is a plane or line
      const P = this.elements.slice();
      const C = obj.pointClosestTo(P).elements;
      return Vector.create([
        C[0] + (C[0] - P[0]),
        C[1] + (C[1] - P[1]),
        C[2] + (C[2] - (P[2] || 0))
      ]);
    }

    // obj is a point
    const Q = obj.elements || obj;
    if (this.elements.length !== Q.length) {
      return null;
    }
    return this.map((x, i) => {
      return Q[i - 1] + (Q[i - 1] - x);
    });
  }

  // Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added

  to3D() {
    const V = this.dup();
    switch (V.elements.length) {
      case 3:
        break;
      case 2:
        V.elements.push(0);
        break;
      default:
        return null;
    }
    return V;
  }

  // Returns a string representation of the vector

  inspect() {
    return `Vector<[${this.elements.join(', ')}]>`;
  }

  // Set vector's elements from an array

  setElements(els) {
    this.elements = (els.elements || els).slice();
    return this;
  }

  toJSON() {
    return this.elements;
  }

  // Constructor function
  static create(elements) {
    const V = new Vector();
    return V.setElements(elements);
  }

  // Random vector of size n
  static Random(n) {
    const elements = [];
    while (n--) {
      elements.push(Math.random());
    }
    return Vector.create(elements);
  }

  static Fill(n, v) {
    const elements = [];
    while (n--) {
      elements.push(v);
    }
    return Vector.create(elements);
  }

  // Vector filled with zeros
  static Zero(n) {
    return Vector.Fill(n, 0);
  }

  static One(n) {
    return Vector.Fill(n, 1);
  }

  static log(v) {
    return v.map(x => {
      return Math.log(x);
    });
  }
}

// i, j, k unit vectors
Vector.i = Vector.create([1, 0, 0]);
Vector.j = Vector.create([0, 1, 0]);
Vector.k = Vector.create([0, 0, 1]);

// The following are shims for deprecated methods removed in 1.0.0
Vector.prototype.modulus = Vector.prototype.magnitude;
Vector.prototype.norm = Vector.prototype.magnitude;
Vector.prototype.dup = function () {
  return this.map(x => x);
};
