// Copyright (c) 2011, Chris Umbel, James Coglan
import { Vector } from './vector';
import { Matrix } from './matrix';
import { Plane } from './plane';
import { Sylvester } from './sylvester';

// Line class - depends on Vector, and some methods require Matrix and Plane.
export class Line {
  // Returns true if the argument occupies the same space as the line
  eql(line) {
    return (this.isParallelTo(line) && this.contains(line.anchor));
  }

  // Returns a copy of the line
  dup() {
    return Line.create(this.anchor, this.direction);
  }

  // Returns the result of translating the line by the given vector/array
  translate(vector) {
    const V = vector.elements || vector;
    return Line.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.direction);
  }

  // Returns true if the line is parallel to the argument. Here, 'parallel to'
  // means that the argument's direction is either parallel or antiparallel to
  // the line's own direction. A line is parallel to a plane if the two do not
  // have a unique intersection.
  isParallelTo(obj) {
    if (obj.normal || (obj.start && obj.end)) {
      return obj.isParallelTo(this);
    }
    const theta = this.direction.angleFrom(obj.direction);
    return (Math.abs(theta) <= Sylvester.precision || Math.abs(theta - Math.PI) <= Sylvester.precision);
  }

  // Returns the line's perpendicular distance from the argument,
  // which can be a point, a line or a plane
  distanceFrom(obj) {
    if (obj.normal || (obj.start && obj.end)) {
      return obj.distanceFrom(this);
    }
    if (obj.direction) {
      // obj is a line
      if (this.isParallelTo(obj)) {
        return this.distanceFrom(obj.anchor);
      }
      const N = this.direction.cross(obj.direction).toUnitVector().elements;
      const A = this.anchor.elements;
      const B = obj.anchor.elements;
      return Math.abs(
        ((A[0] - B[0]) * N[0]) +
        ((A[1] - B[1]) * N[1]) +
        ((A[2] - B[2]) * N[2])
      );
    }

    // obj is a point
    const P = obj.elements || obj;
    const A = this.anchor.elements;
    const D = this.direction.elements;
    const PA1 = P[0] - A[0];
    const PA2 = P[1] - A[1];
    const PA3 = (P[2] || 0) - A[2];
    const modPA = Math.sqrt((PA1 * PA1) + (PA2 * PA2) + (PA3 * PA3));
    if (modPA === 0) {
      return 0;
    }

    // Assumes direction vector is normalized
    const cosTheta = ((PA1 * D[0]) + (PA2 * D[1]) + (PA3 * D[2])) / modPA;
    const sin2 = 1 - (cosTheta * cosTheta);
    return Math.abs(modPA * Math.sqrt(sin2 < 0 ? 0 : sin2));
  }

  // Returns true iff the argument is a point on the line, or if the argument
  // is a line segment lying within the receiver
  contains(obj) {
    if (obj.start && obj.end) {
      return this.contains(obj.start) && this.contains(obj.end);
    }
    const dist = this.distanceFrom(obj);
    return (dist !== null && dist <= Sylvester.precision);
  }

  // Returns the distance from the anchor of the given point. Negative values are
  // returned for points that are in the opposite direction to the line's direction from
  // the line's anchor point.
  positionOf(point) {
    if (!this.contains(point)) {
      return null;
    }
    const P = point.elements || point;
    const A = this.anchor.elements;
    const D = this.direction.elements;
    return ((P[0] - A[0]) * D[0]) +
      ((P[1] - A[1]) * D[1]) +
      (((P[2] || 0) - A[2]) * D[2]);
  }

  // Returns true iff the line lies in the given plane
  liesIn(plane) {
    return plane.contains(this);
  }

  // Returns true iff the line has a unique point of intersection with the argument
  intersects(obj) {
    if (obj.normal) {
      return obj.intersects(this);
    }
    return (!this.isParallelTo(obj) && this.distanceFrom(obj) <= Sylvester.precision);
  }

  // Returns the unique intersection point with the argument, if one exists
  intersectionWith(obj) {
    if (obj.normal || (obj.start && obj.end)) {
      return obj.intersectionWith(this);
    }
    if (!this.intersects(obj)) {
      return null;
    }
    const P = this.anchor.elements;
    const X = this.direction.elements;
    const Q = obj.anchor.elements;
    const Y = obj.direction.elements;
    const X1 = X[0];
    const X2 = X[1];
    const X3 = X[2];
    const Y1 = Y[0];
    const Y2 = Y[1];
    const Y3 = Y[2];
    const PsubQ1 = P[0] - Q[0];
    const PsubQ2 = P[1] - Q[1];
    const PsubQ3 = P[2] - Q[2];
    const XdotQsubP = (-X1 * PsubQ1) - (X2 * PsubQ2) - (X3 * PsubQ3);
    const YdotPsubQ = (Y1 * PsubQ1) + (Y2 * PsubQ2) + (Y3 * PsubQ3);
    const XdotX = (X1 * X1) + (X2 * X2) + (X3 * X3);
    const YdotY = (Y1 * Y1) + (Y2 * Y2) + (Y3 * Y3);
    const XdotY = (X1 * Y1) + (X2 * Y2) + (X3 * Y3);
    const k = ((XdotQsubP * YdotY / XdotX) + (XdotY * YdotPsubQ)) / (YdotY - (XdotY * XdotY));

    return Vector.create([P[0] + (k * X1), P[1] + (k * X2), P[2] + (k * X3)]);
  }

  // Returns the point on the line that is closest to the given point or line/line segment
  pointClosestTo(obj) {
    if (obj.start && obj.end) {
      // obj is a line segment
      const P = obj.pointClosestTo(this);
      return (P === null) ? null : this.pointClosestTo(P);
    }
    if (obj.direction) {
      // obj is a line
      if (this.intersects(obj)) {
        return this.intersectionWith(obj);
      }
      if (this.isParallelTo(obj)) {
        return null;
      }
      const D = this.direction.elements;
      const E = obj.direction.elements;
      const D1 = D[0];
      const D2 = D[1];
      const D3 = D[2];
      const E1 = E[0];
      const E2 = E[1];
      const E3 = E[2];

      // Create plane containing obj and the shared normal and intersect this with it
      // Thank you: http://www.cgafaq.info/wiki/Line-line_distance
      const x = (D3 * E1) - (D1 * E3);
      const y = (D1 * E2) - (D2 * E1);
      const z = (D2 * E3) - (D3 * E2);
      const N = [(x * E3) - (y * E2), (y * E1) - (z * E3), (z * E2) - (x * E1)];
      const P = Plane.create(obj.anchor, N);
      return P.intersectionWith(this);
    }

    // obj is a point
    const P = obj.elements || obj;
    if (this.contains(P)) {
      return Vector.create(P);
    }
    const A = this.anchor.elements;
    const D = this.direction.elements;
    const D1 = D[0];
    const D2 = D[1];
    const D3 = D[2];
    const A1 = A[0];
    const A2 = A[1];
    const A3 = A[2];
    const x = (D1 * (P[1] - A2)) - (D2 * (P[0] - A1));
    const y = (D2 * ((P[2] || 0) - A3)) - (D3 * (P[1] - A2));
    const z = (D3 * (P[0] - A1)) - (D1 * ((P[2] || 0) - A3));
    const V = Vector.create([(D2 * x) - (D3 * z), (D3 * y) - (D1 * x), (D1 * z) - (D2 * y)]);
    const k = this.distanceFrom(P) / V.modulus();
    return Vector.create([
      P[0] + (V.elements[0] * k),
      P[1] + (V.elements[1] * k),
      (P[2] || 0) + (V.elements[2] * k)
    ]);
  }

  // Returns a copy of the line rotated by t radians about the given line. Works by
  // finding the argument's closest point to this line's anchor point (call this C) and
  // rotating the anchor about C. Also rotates the line's direction about the argument's.
  // Be careful with this - the rotation axis' direction affects the outcome!
  rotate(t, line) {
    // If we're working in 2D
    if (typeof (line.direction) === 'undefined') {
      line = Line.create(line.to3D(), Vector.k);
    }
    const R = Matrix.Rotation(t, line.direction).elements;
    const C = line.pointClosestTo(this.anchor).elements;
    const A = this.anchor.elements;
    const D = this.direction.elements;
    const C1 = C[0];
    const C2 = C[1];
    const C3 = C[2];
    const A1 = A[0];
    const A2 = A[1];
    const A3 = A[2];
    const x = A1 - C1;
    const y = A2 - C2;
    const z = A3 - C3;
    return Line.create([
      C1 + (R[0][0] * x) + (R[0][1] * y) + (R[0][2] * z),
      C2 + (R[1][0] * x) + (R[1][1] * y) + (R[1][2] * z),
      C3 + (R[2][0] * x) + (R[2][1] * y) + (R[2][2] * z)
    ], [
      (R[0][0] * D[0]) + (R[0][1] * D[1]) + (R[0][2] * D[2]),
      (R[1][0] * D[0]) + (R[1][1] * D[1]) + (R[1][2] * D[2]),
      (R[2][0] * D[0]) + (R[2][1] * D[1]) + (R[2][2] * D[2])
    ]);
  }

  // Returns a copy of the line with its direction vector reversed.
  // Useful when using lines for rotations.
  reverse() {
    return Line.create(this.anchor, this.direction.x(-1));
  }

  // Returns the line's reflection in the given point or line
  reflectionIn(obj) {
    if (obj.normal) {
      // obj is a plane
      const A = this.anchor.elements;

      const D = this.direction.elements;
      const A1 = A[0];
      const A2 = A[1];
      const A3 = A[2];
      const D1 = D[0];
      const D2 = D[1];
      const D3 = D[2];
      const newA = this.anchor.reflectionIn(obj).elements;

      // Add the line's direction vector to its anchor, then mirror that in the plane
      const AD1 = A1 + D1;

      const AD2 = A2 + D2;
      const AD3 = A3 + D3;
      const Q = obj.pointClosestTo([AD1, AD2, AD3]).elements;
      const newD = [
        Q[0] + (Q[0] - AD1) - newA[0],
        Q[1] + (Q[1] - AD2) - newA[1],
        Q[2] + (Q[2] - AD3) - newA[2]
      ];
      return Line.create(newA, newD);
    }
    if (obj.direction) {
      // obj is a line - reflection obtained by rotating PI radians about obj
      return this.rotate(Math.PI, obj);
    }

    // obj is a point - just reflect the line's anchor in it
    const P = obj.elements || obj;
    return Line.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.direction);
  }

  // Set the line's anchor point and direction.
  setVectors(anchor, direction) {
    // Need to do this so that line's properties are not
    // references to the arguments passed in
    anchor = Vector.create(anchor);
    direction = Vector.create(direction);
    if (anchor.elements.length === 2) {
      anchor.elements.push(0);
    }
    if (direction.elements.length === 2) {
      direction.elements.push(0);
    }
    if (anchor.elements.length > 3 || direction.elements.length > 3) {
      return null;
    }
    const mod = direction.modulus();
    if (mod === 0) {
      return null;
    }
    this.anchor = anchor;
    this.direction = Vector.create([
      direction.elements[0] / mod,
      direction.elements[1] / mod,
      direction.elements[2] / mod
    ]);
    return this;
  }

  // Constructor function
  static create(anchor, direction) {
    const L = new Line();
    return L.setVectors(anchor, direction);
  }
}

export class Segment {
  // Returns true iff the line segment is equal to the argument
  eql(segment) {
    return (this.start.eql(segment.start) && this.end.eql(segment.end)) ||
        (this.start.eql(segment.end) && this.end.eql(segment.start));
  }

  // Returns a copy of the line segment
  dup() {
    return Segment.create(this.start, this.end);
  }

  // Returns the length of the line segment
  length() {
    const A = this.start.elements;
    const B = this.end.elements;
    const C1 = B[0] - A[0];
    const C2 = B[1] - A[1];
    const C3 = B[2] - A[2];
    return Math.sqrt((C1 * C1) + (C2 * C2) + (C3 * C3));
  }

  // Returns the line segment as a vector equal to its
  // end point relative to its endpoint
  toVector() {
    const A = this.start.elements;
    const B = this.end.elements;
    return Vector.create([B[0] - A[0], B[1] - A[1], B[2] - A[2]]);
  }

  // Returns the segment's midpoint as a vector
  midpoint() {
    const A = this.start.elements;
    const B = this.end.elements;
    return Vector.create([(B[0] + A[0]) / 2, (B[1] + A[1]) / 2, (B[2] + A[2]) / 2]);
  }

  // Returns the plane that bisects the segment
  bisectingPlane() {
    return Plane.create(this.midpoint(), this.toVector());
  }

  // Returns the result of translating the line by the given vector/array
  translate(vector) {
    const V = vector.elements || vector;
    const S = this.start.elements;
    const E = this.end.elements;
    return Segment.create(
      [S[0] + V[0], S[1] + V[1], S[2] + (V[2] || 0)],
      [E[0] + V[0], E[1] + V[1], E[2] + (V[2] || 0)]
    );
  }

  // Returns true iff the line segment is parallel to the argument. It simply forwards
  // the method call onto its line property.
  isParallelTo(obj) {
    return this.line.isParallelTo(obj);
  }

  // Returns the distance between the argument and the line segment's closest point to the argument
  distanceFrom(obj) {
    const P = this.pointClosestTo(obj);
    return (P === null) ? null : P.distanceFrom(obj);
  }

  // Returns true iff the given point lies on the segment
  contains(obj) {
    if (obj.start && obj.end) {
      return this.contains(obj.start) && this.contains(obj.end);
    }
    const P = (obj.elements || obj).slice();
    if (P.length === 2) {
      P.push(0);
    }
    if (this.start.eql(P)) {
      return true;
    }
    const S = this.start.elements;
    const V = Vector.create([S[0] - P[0], S[1] - P[1], S[2] - (P[2] || 0)]);
    const vect = this.toVector();
    return V.isAntiparallelTo(vect) && V.modulus() <= vect.modulus();
  }

  // Returns true iff the line segment intersects the argument
  intersects(obj) {
    return (this.intersectionWith(obj) !== null);
  }

  // Returns the unique point of intersection with the argument
  intersectionWith(obj) {
    if (!this.line.intersects(obj)) {
      return null;
    }
    const P = this.line.intersectionWith(obj);
    return (this.contains(P) ? P : null);
  }

  // Returns the point on the line segment closest to the given object
  pointClosestTo(obj) {
    if (obj.normal) {
      // obj is a plane
      const V = this.line.intersectionWith(obj);
      if (V === null) {
        return null;
      }
      return this.pointClosestTo(V);
    }

    // obj is a line (segment) or point
    const P = this.line.pointClosestTo(obj);
    if (P === null) {
      return null;
    }
    if (this.contains(P)) {
      return P;
    }

    return (this.line.positionOf(P) < 0 ? this.start : this.end).dup();
  }

  // Set the start and end-points of the segment
  setPoints(startPoint, endPoint) {
    startPoint = Vector.create(startPoint).to3D();
    endPoint = Vector.create(endPoint).to3D();
    if (startPoint === null || endPoint === null) {
      return null;
    }
    this.line = Line.create(startPoint, endPoint.subtract(startPoint));
    this.start = startPoint;
    this.end = endPoint;
    return this;
  }

  // Constructor function
  static create(v1, v2) {
    const S = new Segment();
    return S.setPoints(v1, v2);
  }
}

// Axes
Line.X = Line.create(Vector.Zero(3), Vector.i);
Line.Y = Line.create(Vector.Zero(3), Vector.j);
Line.Z = Line.create(Vector.Zero(3), Vector.k);
Line.Segment = Segment;
