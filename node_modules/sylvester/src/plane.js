import { Line } from './line';
import { Matrix } from './matrix';
import { Sylvester } from './sylvester';
import { Vector } from './vector';

export class Plane {
  // Returns true iff the plane occupies the same space as the argument
  eql(plane) {
    return (this.contains(plane.anchor) && this.isParallelTo(plane));
  }

  // Returns a copy of the plane
  dup() {
    return Plane.create(this.anchor, this.normal);
  }

  // Returns the result of translating the plane by the given vector
  translate(vector) {
    const V = vector.elements || vector;
    return Plane.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.normal);
  }

  // Returns true iff the plane is parallel to the argument. Will return true
  // if the planes are equal, or if you give a line and it lies in the plane.
  isParallelTo(obj) {
    let theta;
    if (obj.normal) {
      // obj is a plane
      theta = this.normal.angleFrom(obj.normal);
      return (Math.abs(theta) <= Sylvester.precision || Math.abs(Math.PI - theta) <= Sylvester.precision);
    } else if (obj.direction) {
      // obj is a line
      return this.normal.isPerpendicularTo(obj.direction);
    }
    return null;
  }

  // Returns true iff the receiver is perpendicular to the argument
  isPerpendicularTo(plane) {
    const theta = this.normal.angleFrom(plane.normal);
    return Math.abs((Math.PI / 2) - theta) <= Sylvester.precision;
  }

  // Returns the plane's distance from the given object (point, line or plane)
  distanceFrom(obj) {
    if (this.intersects(obj) || this.contains(obj)) {
      return 0;
    }
    if (obj.anchor) {
      // obj is a plane or line
      const A = this.anchor.elements;
      const B = obj.anchor.elements;
      const N = this.normal.elements;
      return Math.abs(((A[0] - B[0]) * N[0]) + ((A[1] - B[1]) * N[1]) + ((A[2] - B[2]) * N[2]));
    }

    // obj is a point
    const P = obj.elements || obj;
    const A = this.anchor.elements;
    const N = this.normal.elements;
    return Math.abs(((A[0] - P[0]) * N[0]) + ((A[1] - P[1]) * N[1]) + ((A[2] - (P[2] || 0)) * N[2]));
  }

  // Returns true iff the plane contains the given point or line
  contains(obj) {
    if (obj.normal) {
      return null;
    }
    if (obj.direction) {
      return (this.contains(obj.anchor) && this.contains(obj.anchor.add(obj.direction)));
    }

    const P = obj.elements || obj;
    const A = this.anchor.elements;
    const N = this.normal.elements;
    const diff = Math.abs((N[0] * (A[0] - P[0])) + (N[1] * (A[1] - P[1])) + (N[2] * (A[2] - (P[2] || 0))));
    return (diff <= Sylvester.precision);
  }

  // Returns true iff the plane has a unique point/line of intersection with the argument
  intersects(obj) {
    if (typeof (obj.direction) === 'undefined' && typeof (obj.normal) === 'undefined') {
      return null;
    }
    return !this.isParallelTo(obj);
  }

  // Returns the unique intersection with the argument, if one exists. The result
  // will be a vector if a line is supplied, and a line if a plane is supplied.
  intersectionWith(obj) {
    if (!this.intersects(obj)) {
      return null;
    }

    if (obj.direction) {
      // obj is a line
      const A = obj.anchor.elements;

      const D = obj.direction.elements;
      const P = this.anchor.elements;
      const N = this.normal.elements;
      const multiplier = (
        (N[0] * (P[0] - A[0])) +
        (N[1] * (P[1] - A[1])) +
        (N[2] * (P[2] - A[2]))
      ) / (
        (N[0] * D[0]) +
        (N[1] * D[1]) +
        (N[2] * D[2])
      );

      return Vector.create([
        A[0] + (D[0] * multiplier),
        A[1] + (D[1] * multiplier),
        A[2] + (D[2] * multiplier)
      ]);
    }

    if (obj.normal) {
      // obj is a plane
      const direction = this.normal.cross(obj.normal).toUnitVector();

      // To find an anchor point, we find one co-ordinate that has a value
      // of zero somewhere on the intersection, and remember which one we picked
      const N = this.normal.elements;

      const A = this.anchor.elements;
      const O = obj.normal.elements;
      const B = obj.anchor.elements;
      let solver = Matrix.Zero(2, 2);
      let i = 0;
      while (solver.isSingular()) {
        i++;
        solver = Matrix.create([
          [N[i % 3], N[(i + 1) % 3]],
          [O[i % 3], O[(i + 1) % 3]]
        ]);
      }
      // Then we solve the simultaneous equations in the remaining dimensions
      const inverse = solver.inverse().elements;
      const x = (N[0] * A[0]) + (N[1] * A[1]) + (N[2] * A[2]);
      const y = (O[0] * B[0]) + (O[1] * B[1]) + (O[2] * B[2]);
      const intersection = [
        (inverse[0][0] * x) + (inverse[0][1] * y),
        (inverse[1][0] * x) + (inverse[1][1] * y)
      ];
      const anchor = [];
      for (let j = 1; j <= 3; j++) {
        // This formula picks the right element from intersection by
        // cycling depending on which element we set to zero above
        anchor.push((i === j) ? 0 : intersection[(j + ((5 - i) % 3)) % 3]);
      }
      return Line.create(anchor, direction);
    }

    return null; // todo(connor4312): is this a case that needs to be handled?
  }

  // Returns the point in the plane closest to the given point
  pointClosestTo(point) {
    const P = point.elements || point;
    const A = this.anchor.elements;
    const N = this.normal.elements;
    const dot = ((A[0] - P[0]) * N[0]) + ((A[1] - P[1]) * N[1]) + ((A[2] - (P[2] || 0)) * N[2]);
    return Vector.create([P[0] + (N[0] * dot), P[1] + (N[1] * dot), (P[2] || 0) + (N[2] * dot)]);
  }

  // Returns a copy of the plane, rotated by t radians about the given line
  // See notes on Line#rotate.
  rotate(t, line) {
    const R = t.determinant ? t.elements : Matrix.Rotation(t, line.direction).elements;
    const C = line.pointClosestTo(this.anchor).elements;
    const A = this.anchor.elements;
    const N = this.normal.elements;
    const C1 = C[0];
    const C2 = C[1];
    const C3 = C[2];
    const A1 = A[0];
    const A2 = A[1];
    const A3 = A[2];
    const x = A1 - C1;
    const y = A2 - C2;
    const z = A3 - C3;
    return Plane.create([
      C1 + (R[0][0] * x) + (R[0][1] * y) + (R[0][2] * z),
      C2 + (R[1][0] * x) + (R[1][1] * y) + (R[1][2] * z),
      C3 + (R[2][0] * x) + (R[2][1] * y) + (R[2][2] * z)
    ], [
      (R[0][0] * N[0]) + (R[0][1] * N[1]) + (R[0][2] * N[2]),
      (R[1][0] * N[0]) + (R[1][1] * N[1]) + (R[1][2] * N[2]),
      (R[2][0] * N[0]) + (R[2][1] * N[1]) + (R[2][2] * N[2])
    ]);
  }

  // Returns the reflection of the plane in the given point, line or plane.
  reflectionIn(obj) {
    if (obj.normal) {
      // obj is a plane
      const A = this.anchor.elements;

      const N = this.normal.elements;
      const A1 = A[0];
      const A2 = A[1];
      const A3 = A[2];
      const N1 = N[0];
      const N2 = N[1];
      const N3 = N[2];
      const newA = this.anchor.reflectionIn(obj).elements;

      // Add the plane's normal to its anchor, then mirror that in the other plane
      const AN1 = A1 + N1;

      const AN2 = A2 + N2;
      const AN3 = A3 + N3;
      const Q = obj.pointClosestTo([AN1, AN2, AN3]).elements;
      const newN = [Q[0] + (Q[0] - AN1) - newA[0], Q[1] + (Q[1] - AN2) - newA[1], Q[2] + (Q[2] - AN3) - newA[2]];
      return Plane.create(newA, newN);
    }
    if (obj.direction) {
      // obj is a line
      return this.rotate(Math.PI, obj);
    }

    // obj is a point
    const P = obj.elements || obj;
    return Plane.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.normal);
  }

  // Sets the anchor point and normal to the plane. If three arguments are specified,
  // the normal is calculated by assuming the three points should lie in the same plane.
  // If only two are sepcified, the second is taken to be the normal. Normal vector is
  // normalised before storage.
  setVectors(anchor, v1, v2) {
    anchor = Vector.create(anchor);
    anchor = anchor.to3D();
    if (anchor === null) {
      return null;
    }
    v1 = Vector.create(v1);
    v1 = v1.to3D();
    if (v1 === null) {
      return null;
    }
    if (typeof (v2) === 'undefined') {
      v2 = null;
    } else {
      v2 = Vector.create(v2);
      v2 = v2.to3D();
      if (v2 === null) {
        return null;
      }
    }
    const A1 = anchor.elements[0];
    const A2 = anchor.elements[1];
    const A3 = anchor.elements[2];
    const v11 = v1.elements[0];
    const v12 = v1.elements[1];
    const v13 = v1.elements[2];
    let normal;
    let mod;
    if (v2 === null) {
      mod = Math.sqrt((v11 * v11) + (v12 * v12) + (v13 * v13));
      if (mod === 0) {
        return null;
      }
      normal = Vector.create([
        v1.elements[0] / mod,
        v1.elements[1] / mod,
        v1.elements[2] / mod
      ]);
    } else {
      const v21 = v2.elements[0];
      const v22 = v2.elements[1];
      const v23 = v2.elements[2];
      normal = Vector.create([
        ((v12 - A2) * (v23 - A3)) - ((v13 - A3) * (v22 - A2)),
        ((v13 - A3) * (v21 - A1)) - ((v11 - A1) * (v23 - A3)),
        ((v11 - A1) * (v22 - A2)) - ((v12 - A2) * (v21 - A1))
      ]);
      mod = normal.modulus();
      if (mod === 0) {
        return null;
      }
      normal = Vector.create([
        normal.elements[0] / mod,
        normal.elements[1] / mod,
        normal.elements[2] / mod
      ]);
    }

    this.anchor = anchor;
    this.normal = normal;
    return this;
  }

  // Constructor function
  static create(anchor, v1, v2) {
    const P = new Plane();
    return P.setVectors(anchor, v1, v2);
  }

  // Returns the plane containing the given points (can be arrays as
  // well as vectors). If the points are not coplanar, returns null.
  static fromPoints(points) {
    const np = points.length;
    const list = [];
    let i;
    let P;
    let n;
    let N;
    let A;
    let B;
    let C;
    let theta;
    let prevN;
    let totalN = Vector.Zero(3);
    for (i = 0; i < np; i++) {
      P = Vector.create(points[i]).to3D();
      if (P === null) {
        return null;
      }
      list.push(P);
      n = list.length;
      if (n > 2) {
        // Compute plane normal for the latest three points
        A = list[n - 1].elements;
        B = list[n - 2].elements;
        C = list[n - 3].elements;
        N = Vector.create([
          ((A[1] - B[1]) * (C[2] - B[2])) - ((A[2] - B[2]) * (C[1] - B[1])),
          ((A[2] - B[2]) * (C[0] - B[0])) - ((A[0] - B[0]) * (C[2] - B[2])),
          ((A[0] - B[0]) * (C[1] - B[1])) - ((A[1] - B[1]) * (C[0] - B[0]))
        ]).toUnitVector();

        if (n > 3) {
          // If the latest normal is not (anti)parallel to the previous one, we've strayed off the plane.
          // This might be a slightly long-winded way of doing things, but we need the sum of all the normals
          // to find which way the plane normal should point so that the points form an anticlockwise list.
          theta = N.angleFrom(prevN);
          if (theta !== null) {
            if (!(Math.abs(theta) <= Sylvester.precision || Math.abs(theta - Math.PI) <= Sylvester.precision)) {
              return null;
            }
          }
        }
        totalN = totalN.add(N);
        prevN = N;
      }
    }
    // We need to add in the normals at the start and end points, which the above misses out
    A = list[1].elements;
    B = list[0].elements;
    C = list[n - 1].elements;
    const D = list[n - 2].elements;
    totalN = totalN.add(Vector.create([
      ((A[1] - B[1]) * (C[2] - B[2])) - ((A[2] - B[2]) * (C[1] - B[1])),
      ((A[2] - B[2]) * (C[0] - B[0])) - ((A[0] - B[0]) * (C[2] - B[2])),
      ((A[0] - B[0]) * (C[1] - B[1])) - ((A[1] - B[1]) * (C[0] - B[0]))
    ]).toUnitVector()).add(Vector.create([
      ((B[1] - C[1]) * (D[2] - C[2])) - ((B[2] - C[2]) * (D[1] - C[1])),
      ((B[2] - C[2]) * (D[0] - C[0])) - ((B[0] - C[0]) * (D[2] - C[2])),
      ((B[0] - C[0]) * (D[1] - C[1])) - ((B[1] - C[1]) * (D[0] - C[0]))
    ]).toUnitVector());
    return Plane.create(list[0], totalN);
  }
}

// X-Y-Z planes
Plane.XY = Plane.YX = Plane.create(Vector.Zero(3), Vector.k);
Plane.YZ = Plane.ZY = Plane.create(Vector.Zero(3), Vector.i);
Plane.ZX = Plane.XZ = Plane.create(Vector.Zero(3), Vector.j);
