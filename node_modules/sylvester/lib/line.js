'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Segment = exports.Line = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Copyright (c) 2011, Chris Umbel, James Coglan


var _vector = require('./vector');

var _matrix = require('./matrix');

var _plane = require('./plane');

var _sylvester = require('./sylvester');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Line class - depends on Vector, and some methods require Matrix and Plane.
var Line = exports.Line = function () {
  function Line() {
    _classCallCheck(this, Line);
  }

  _createClass(Line, [{
    key: 'eql',

    // Returns true if the argument occupies the same space as the line
    value: function eql(line) {
      return this.isParallelTo(line) && this.contains(line.anchor);
    }

    // Returns a copy of the line

  }, {
    key: 'dup',
    value: function dup() {
      return Line.create(this.anchor, this.direction);
    }

    // Returns the result of translating the line by the given vector/array

  }, {
    key: 'translate',
    value: function translate(vector) {
      var V = vector.elements || vector;
      return Line.create([this.anchor.elements[0] + V[0], this.anchor.elements[1] + V[1], this.anchor.elements[2] + (V[2] || 0)], this.direction);
    }

    // Returns true if the line is parallel to the argument. Here, 'parallel to'
    // means that the argument's direction is either parallel or antiparallel to
    // the line's own direction. A line is parallel to a plane if the two do not
    // have a unique intersection.

  }, {
    key: 'isParallelTo',
    value: function isParallelTo(obj) {
      if (obj.normal || obj.start && obj.end) {
        return obj.isParallelTo(this);
      }
      var theta = this.direction.angleFrom(obj.direction);
      return Math.abs(theta) <= _sylvester.Sylvester.precision || Math.abs(theta - Math.PI) <= _sylvester.Sylvester.precision;
    }

    // Returns the line's perpendicular distance from the argument,
    // which can be a point, a line or a plane

  }, {
    key: 'distanceFrom',
    value: function distanceFrom(obj) {
      if (obj.normal || obj.start && obj.end) {
        return obj.distanceFrom(this);
      }
      if (obj.direction) {
        // obj is a line
        if (this.isParallelTo(obj)) {
          return this.distanceFrom(obj.anchor);
        }
        var N = this.direction.cross(obj.direction).toUnitVector().elements;
        var _A = this.anchor.elements;
        var B = obj.anchor.elements;
        return Math.abs((_A[0] - B[0]) * N[0] + (_A[1] - B[1]) * N[1] + (_A[2] - B[2]) * N[2]);
      }

      // obj is a point
      var P = obj.elements || obj;
      var A = this.anchor.elements;
      var D = this.direction.elements;
      var PA1 = P[0] - A[0];
      var PA2 = P[1] - A[1];
      var PA3 = (P[2] || 0) - A[2];
      var modPA = Math.sqrt(PA1 * PA1 + PA2 * PA2 + PA3 * PA3);
      if (modPA === 0) {
        return 0;
      }

      // Assumes direction vector is normalized
      var cosTheta = (PA1 * D[0] + PA2 * D[1] + PA3 * D[2]) / modPA;
      var sin2 = 1 - cosTheta * cosTheta;
      return Math.abs(modPA * Math.sqrt(sin2 < 0 ? 0 : sin2));
    }

    // Returns true iff the argument is a point on the line, or if the argument
    // is a line segment lying within the receiver

  }, {
    key: 'contains',
    value: function contains(obj) {
      if (obj.start && obj.end) {
        return this.contains(obj.start) && this.contains(obj.end);
      }
      var dist = this.distanceFrom(obj);
      return dist !== null && dist <= _sylvester.Sylvester.precision;
    }

    // Returns the distance from the anchor of the given point. Negative values are
    // returned for points that are in the opposite direction to the line's direction from
    // the line's anchor point.

  }, {
    key: 'positionOf',
    value: function positionOf(point) {
      if (!this.contains(point)) {
        return null;
      }
      var P = point.elements || point;
      var A = this.anchor.elements;
      var D = this.direction.elements;
      return (P[0] - A[0]) * D[0] + (P[1] - A[1]) * D[1] + ((P[2] || 0) - A[2]) * D[2];
    }

    // Returns true iff the line lies in the given plane

  }, {
    key: 'liesIn',
    value: function liesIn(plane) {
      return plane.contains(this);
    }

    // Returns true iff the line has a unique point of intersection with the argument

  }, {
    key: 'intersects',
    value: function intersects(obj) {
      if (obj.normal) {
        return obj.intersects(this);
      }
      return !this.isParallelTo(obj) && this.distanceFrom(obj) <= _sylvester.Sylvester.precision;
    }

    // Returns the unique intersection point with the argument, if one exists

  }, {
    key: 'intersectionWith',
    value: function intersectionWith(obj) {
      if (obj.normal || obj.start && obj.end) {
        return obj.intersectionWith(this);
      }
      if (!this.intersects(obj)) {
        return null;
      }
      var P = this.anchor.elements;
      var X = this.direction.elements;
      var Q = obj.anchor.elements;
      var Y = obj.direction.elements;
      var X1 = X[0];
      var X2 = X[1];
      var X3 = X[2];
      var Y1 = Y[0];
      var Y2 = Y[1];
      var Y3 = Y[2];
      var PsubQ1 = P[0] - Q[0];
      var PsubQ2 = P[1] - Q[1];
      var PsubQ3 = P[2] - Q[2];
      var XdotQsubP = -X1 * PsubQ1 - X2 * PsubQ2 - X3 * PsubQ3;
      var YdotPsubQ = Y1 * PsubQ1 + Y2 * PsubQ2 + Y3 * PsubQ3;
      var XdotX = X1 * X1 + X2 * X2 + X3 * X3;
      var YdotY = Y1 * Y1 + Y2 * Y2 + Y3 * Y3;
      var XdotY = X1 * Y1 + X2 * Y2 + X3 * Y3;
      var k = (XdotQsubP * YdotY / XdotX + XdotY * YdotPsubQ) / (YdotY - XdotY * XdotY);

      return _vector.Vector.create([P[0] + k * X1, P[1] + k * X2, P[2] + k * X3]);
    }

    // Returns the point on the line that is closest to the given point or line/line segment

  }, {
    key: 'pointClosestTo',
    value: function pointClosestTo(obj) {
      if (obj.start && obj.end) {
        // obj is a line segment
        var _P = obj.pointClosestTo(this);
        return _P === null ? null : this.pointClosestTo(_P);
      }
      if (obj.direction) {
        // obj is a line
        if (this.intersects(obj)) {
          return this.intersectionWith(obj);
        }
        if (this.isParallelTo(obj)) {
          return null;
        }
        var _D = this.direction.elements;
        var E = obj.direction.elements;
        var _D2 = _D[0];
        var _D3 = _D[1];
        var _D4 = _D[2];
        var E1 = E[0];
        var E2 = E[1];
        var E3 = E[2];

        // Create plane containing obj and the shared normal and intersect this with it
        // Thank you: http://www.cgafaq.info/wiki/Line-line_distance
        var _x = _D4 * E1 - _D2 * E3;
        var _y = _D2 * E2 - _D3 * E1;
        var _z = _D3 * E3 - _D4 * E2;
        var N = [_x * E3 - _y * E2, _y * E1 - _z * E3, _z * E2 - _x * E1];
        var _P2 = _plane.Plane.create(obj.anchor, N);
        return _P2.intersectionWith(this);
      }

      // obj is a point
      var P = obj.elements || obj;
      if (this.contains(P)) {
        return _vector.Vector.create(P);
      }
      var A = this.anchor.elements;
      var D = this.direction.elements;
      var D1 = D[0];
      var D2 = D[1];
      var D3 = D[2];
      var A1 = A[0];
      var A2 = A[1];
      var A3 = A[2];
      var x = D1 * (P[1] - A2) - D2 * (P[0] - A1);
      var y = D2 * ((P[2] || 0) - A3) - D3 * (P[1] - A2);
      var z = D3 * (P[0] - A1) - D1 * ((P[2] || 0) - A3);
      var V = _vector.Vector.create([D2 * x - D3 * z, D3 * y - D1 * x, D1 * z - D2 * y]);
      var k = this.distanceFrom(P) / V.modulus();
      return _vector.Vector.create([P[0] + V.elements[0] * k, P[1] + V.elements[1] * k, (P[2] || 0) + V.elements[2] * k]);
    }

    // Returns a copy of the line rotated by t radians about the given line. Works by
    // finding the argument's closest point to this line's anchor point (call this C) and
    // rotating the anchor about C. Also rotates the line's direction about the argument's.
    // Be careful with this - the rotation axis' direction affects the outcome!

  }, {
    key: 'rotate',
    value: function rotate(t, line) {
      // If we're working in 2D
      if (typeof line.direction === 'undefined') {
        line = Line.create(line.to3D(), _vector.Vector.k);
      }
      var R = _matrix.Matrix.Rotation(t, line.direction).elements;
      var C = line.pointClosestTo(this.anchor).elements;
      var A = this.anchor.elements;
      var D = this.direction.elements;
      var C1 = C[0];
      var C2 = C[1];
      var C3 = C[2];
      var A1 = A[0];
      var A2 = A[1];
      var A3 = A[2];
      var x = A1 - C1;
      var y = A2 - C2;
      var z = A3 - C3;
      return Line.create([C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z, C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z, C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z], [R[0][0] * D[0] + R[0][1] * D[1] + R[0][2] * D[2], R[1][0] * D[0] + R[1][1] * D[1] + R[1][2] * D[2], R[2][0] * D[0] + R[2][1] * D[1] + R[2][2] * D[2]]);
    }

    // Returns a copy of the line with its direction vector reversed.
    // Useful when using lines for rotations.

  }, {
    key: 'reverse',
    value: function reverse() {
      return Line.create(this.anchor, this.direction.x(-1));
    }

    // Returns the line's reflection in the given point or line

  }, {
    key: 'reflectionIn',
    value: function reflectionIn(obj) {
      if (obj.normal) {
        // obj is a plane
        var A = this.anchor.elements;

        var D = this.direction.elements;
        var A1 = A[0];
        var A2 = A[1];
        var A3 = A[2];
        var D1 = D[0];
        var D2 = D[1];
        var D3 = D[2];
        var newA = this.anchor.reflectionIn(obj).elements;

        // Add the line's direction vector to its anchor, then mirror that in the plane
        var AD1 = A1 + D1;

        var AD2 = A2 + D2;
        var AD3 = A3 + D3;
        var Q = obj.pointClosestTo([AD1, AD2, AD3]).elements;
        var newD = [Q[0] + (Q[0] - AD1) - newA[0], Q[1] + (Q[1] - AD2) - newA[1], Q[2] + (Q[2] - AD3) - newA[2]];
        return Line.create(newA, newD);
      }
      if (obj.direction) {
        // obj is a line - reflection obtained by rotating PI radians about obj
        return this.rotate(Math.PI, obj);
      }

      // obj is a point - just reflect the line's anchor in it
      var P = obj.elements || obj;
      return Line.create(this.anchor.reflectionIn([P[0], P[1], P[2] || 0]), this.direction);
    }

    // Set the line's anchor point and direction.

  }, {
    key: 'setVectors',
    value: function setVectors(anchor, direction) {
      // Need to do this so that line's properties are not
      // references to the arguments passed in
      anchor = _vector.Vector.create(anchor);
      direction = _vector.Vector.create(direction);
      if (anchor.elements.length === 2) {
        anchor.elements.push(0);
      }
      if (direction.elements.length === 2) {
        direction.elements.push(0);
      }
      if (anchor.elements.length > 3 || direction.elements.length > 3) {
        return null;
      }
      var mod = direction.modulus();
      if (mod === 0) {
        return null;
      }
      this.anchor = anchor;
      this.direction = _vector.Vector.create([direction.elements[0] / mod, direction.elements[1] / mod, direction.elements[2] / mod]);
      return this;
    }

    // Constructor function

  }], [{
    key: 'create',
    value: function create(anchor, direction) {
      var L = new Line();
      return L.setVectors(anchor, direction);
    }
  }]);

  return Line;
}();

var Segment = exports.Segment = function () {
  function Segment() {
    _classCallCheck(this, Segment);
  }

  _createClass(Segment, [{
    key: 'eql',

    // Returns true iff the line segment is equal to the argument
    value: function eql(segment) {
      return this.start.eql(segment.start) && this.end.eql(segment.end) || this.start.eql(segment.end) && this.end.eql(segment.start);
    }

    // Returns a copy of the line segment

  }, {
    key: 'dup',
    value: function dup() {
      return Segment.create(this.start, this.end);
    }

    // Returns the length of the line segment

  }, {
    key: 'length',
    value: function length() {
      var A = this.start.elements;
      var B = this.end.elements;
      var C1 = B[0] - A[0];
      var C2 = B[1] - A[1];
      var C3 = B[2] - A[2];
      return Math.sqrt(C1 * C1 + C2 * C2 + C3 * C3);
    }

    // Returns the line segment as a vector equal to its
    // end point relative to its endpoint

  }, {
    key: 'toVector',
    value: function toVector() {
      var A = this.start.elements;
      var B = this.end.elements;
      return _vector.Vector.create([B[0] - A[0], B[1] - A[1], B[2] - A[2]]);
    }

    // Returns the segment's midpoint as a vector

  }, {
    key: 'midpoint',
    value: function midpoint() {
      var A = this.start.elements;
      var B = this.end.elements;
      return _vector.Vector.create([(B[0] + A[0]) / 2, (B[1] + A[1]) / 2, (B[2] + A[2]) / 2]);
    }

    // Returns the plane that bisects the segment

  }, {
    key: 'bisectingPlane',
    value: function bisectingPlane() {
      return _plane.Plane.create(this.midpoint(), this.toVector());
    }

    // Returns the result of translating the line by the given vector/array

  }, {
    key: 'translate',
    value: function translate(vector) {
      var V = vector.elements || vector;
      var S = this.start.elements;
      var E = this.end.elements;
      return Segment.create([S[0] + V[0], S[1] + V[1], S[2] + (V[2] || 0)], [E[0] + V[0], E[1] + V[1], E[2] + (V[2] || 0)]);
    }

    // Returns true iff the line segment is parallel to the argument. It simply forwards
    // the method call onto its line property.

  }, {
    key: 'isParallelTo',
    value: function isParallelTo(obj) {
      return this.line.isParallelTo(obj);
    }

    // Returns the distance between the argument and the line segment's closest point to the argument

  }, {
    key: 'distanceFrom',
    value: function distanceFrom(obj) {
      var P = this.pointClosestTo(obj);
      return P === null ? null : P.distanceFrom(obj);
    }

    // Returns true iff the given point lies on the segment

  }, {
    key: 'contains',
    value: function contains(obj) {
      if (obj.start && obj.end) {
        return this.contains(obj.start) && this.contains(obj.end);
      }
      var P = (obj.elements || obj).slice();
      if (P.length === 2) {
        P.push(0);
      }
      if (this.start.eql(P)) {
        return true;
      }
      var S = this.start.elements;
      var V = _vector.Vector.create([S[0] - P[0], S[1] - P[1], S[2] - (P[2] || 0)]);
      var vect = this.toVector();
      return V.isAntiparallelTo(vect) && V.modulus() <= vect.modulus();
    }

    // Returns true iff the line segment intersects the argument

  }, {
    key: 'intersects',
    value: function intersects(obj) {
      return this.intersectionWith(obj) !== null;
    }

    // Returns the unique point of intersection with the argument

  }, {
    key: 'intersectionWith',
    value: function intersectionWith(obj) {
      if (!this.line.intersects(obj)) {
        return null;
      }
      var P = this.line.intersectionWith(obj);
      return this.contains(P) ? P : null;
    }

    // Returns the point on the line segment closest to the given object

  }, {
    key: 'pointClosestTo',
    value: function pointClosestTo(obj) {
      if (obj.normal) {
        // obj is a plane
        var V = this.line.intersectionWith(obj);
        if (V === null) {
          return null;
        }
        return this.pointClosestTo(V);
      }

      // obj is a line (segment) or point
      var P = this.line.pointClosestTo(obj);
      if (P === null) {
        return null;
      }
      if (this.contains(P)) {
        return P;
      }

      return (this.line.positionOf(P) < 0 ? this.start : this.end).dup();
    }

    // Set the start and end-points of the segment

  }, {
    key: 'setPoints',
    value: function setPoints(startPoint, endPoint) {
      startPoint = _vector.Vector.create(startPoint).to3D();
      endPoint = _vector.Vector.create(endPoint).to3D();
      if (startPoint === null || endPoint === null) {
        return null;
      }
      this.line = Line.create(startPoint, endPoint.subtract(startPoint));
      this.start = startPoint;
      this.end = endPoint;
      return this;
    }

    // Constructor function

  }], [{
    key: 'create',
    value: function create(v1, v2) {
      var S = new Segment();
      return S.setPoints(v1, v2);
    }
  }]);

  return Segment;
}();

// Axes


Line.X = Line.create(_vector.Vector.Zero(3), _vector.Vector.i);
Line.Y = Line.create(_vector.Vector.Zero(3), _vector.Vector.j);
Line.Z = Line.create(_vector.Vector.Zero(3), _vector.Vector.k);
Line.Segment = Segment;