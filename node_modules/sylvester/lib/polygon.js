'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vertex = exports.Polygon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _line = require('./line');

var _linkedlist = require('./linkedlist');

var _matrix = require('./matrix');

var _plane = require('./plane');

var _sylvester = require('./sylvester');

var _vector = require('./vector');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = exports.Polygon = function () {
  function Polygon() {
    _classCallCheck(this, Polygon);
  }

  _createClass(Polygon, [{
    key: 'v',

    // Returns the vertex at the given position on the vertex list, numbered from 1.
    value: function v(i) {
      return this.vertices.at(i - 1).data;
    }

    // Returns the node in the vertices linked list that refers to the given vertex.

  }, {
    key: 'nodeFor',
    value: function nodeFor(vertex) {
      return this.vertices.withData(vertex);
    }

    // Returns a new polygon with the same vertices as the receiver. The vertices
    // will not be duplicates, they refer to the same objects as the vertices in this
    // polygon, but the linked list and nodes used to point to them are separate and
    // can be manipulated independently of this one.

  }, {
    key: 'dup',
    value: function dup() {
      return Polygon.create(this.vertices, this.plane);
    }

    // Translates the polygon by the given vector and returns the polygon.

  }, {
    key: 'translate',
    value: function translate(vector) {
      var P = vector.elements || vector;
      this.vertices.each(function (node) {
        var E = node.data.elements;
        node.data.setElements([E[0] + P[0], E[1] + P[1], E[2] + (P[2] || 0)]);
      });
      this.plane = this.plane.translate(vector);
      this.updateTrianglePlanes(function (plane) {
        return plane.translate(vector);
      });
      return this;
    }

    // Rotates the polygon about the given line and returns the polygon.

  }, {
    key: 'rotate',
    value: function rotate(t, line) {
      var R = _matrix.Matrix.Rotation(t, line.direction);
      this.vertices.each(function (node) {
        node.data.setElements(node.data.rotate(R, line).elements);
      });
      this.plane = this.plane.rotate(R, line);
      this.updateTrianglePlanes(function (plane) {
        return plane.rotate(R, line);
      });
      return this;
    }

    // Scales the polygon relative to the given point and returns the polygon.

  }, {
    key: 'scale',
    value: function scale(k, point) {
      var P = point.elements || point;
      this.vertices.each(function (node) {
        var E = node.data.elements;
        node.data.setElements([P[0] + k * (E[0] - P[0]), P[1] + k * (E[1] - P[1]), (P[2] || 0) + k * (E[2] - (P[2] || 0))]);
      });
      var anchor = this.vertices.first.data;
      this.plane.anchor.setElements(anchor);
      this.updateTrianglePlanes(function (plane) {
        return _plane.Plane.create(anchor, plane.normal);
      });
      return this;
    }

    // Updates the plane properties of all the cached triangles belonging to
    // the polygon according to the given function. For example, suppose you
    // just rotated the polygon, you should call:
    //
    //   poly.updateTrianglePlanes(function(plane) { return plane.rotate(t, line); });
    //
    // This method is called automatically by Polygon.translate, Polygon.rotate
    // and Polygon.scale transformation methods.

  }, {
    key: 'updateTrianglePlanes',
    value: function updateTrianglePlanes(fn) {
      var i = void 0;
      if (this.cached.triangles !== null) {
        i = this.cached.triangles.length;
        while (i--) {
          this.cached.triangles[i].plane = fn(this.cached.triangles[i].plane);
        }
      }
      if (this.cached.surfaceIntegralElements !== null) {
        i = this.cached.surfaceIntegralElements.length;
        while (i--) {
          this.cached.surfaceIntegralElements[i].plane = fn(this.cached.surfaceIntegralElements[i].plane);
        }
      }
    }

    // Returns true iff the polygon is a triangle

  }, {
    key: 'isTriangle',
    value: function isTriangle() {
      return this.vertices.length === 3;
    }

    // Returns a collection of triangles used for calculating area and center of mass.
    // Some of the triangles will not lie inside the polygon - this collection is essentially
    // a series of itervals in a surface integral, so some are 'negative'. If you want the
    // polygon broken into constituent triangles, use toTriangles(). This method is used
    // because it's much faster than toTriangles().
    // The triangles generated share vertices with the original polygon, so they transform
    // with the polygon. They are cached after first calculation and should remain in sync
    // with changes to the parent polygon.

  }, {
    key: 'trianglesForSurfaceIntegral',
    value: function trianglesForSurfaceIntegral() {
      if (this.cached.surfaceIntegralElements !== null) {
        return this.cached.surfaceIntegralElements;
      }
      var triangles = [];
      var firstVertex = this.vertices.first.data;
      var plane = this.plane;
      this.vertices.each(function (node, i) {
        if (i < 2) {
          return;
        }
        var points = [firstVertex, node.prev.data, node.data];
        // If the vertices lie on a straigh line, give the polygon's own plane. If the
        // element has no area, it doesn't matter which way its normal faces.
        triangles.push(Polygon.create(points, _plane.Plane.fromPoints(points) || plane));
      });
      return this.setCache('surfaceIntegralElements', triangles);
    }

    // Returns the area of the polygon. Requires that the polygon
    // be converted to triangles, so use with caution.

  }, {
    key: 'area',
    value: function area() {
      if (this.isTriangle()) {
        // Area is half the modulus of the cross product of two sides
        var A = this.vertices.first;
        var B = A.next;
        var C = B.next;
        A = A.data.elements;
        B = B.data.elements;
        C = C.data.elements;

        return 0.5 * _vector.Vector.create([(A[1] - B[1]) * (C[2] - B[2]) - (A[2] - B[2]) * (C[1] - B[1]), (A[2] - B[2]) * (C[0] - B[0]) - (A[0] - B[0]) * (C[2] - B[2]), (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0])]).modulus();
      }

      var trigs = this.trianglesForSurfaceIntegral();
      var area = 0;
      for (var i = 0; i < trigs.length; i++) {
        area += trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
      }

      return area;
    }

    // Returns the centroid of the polygon. Requires division into
    // triangles - use with caution

  }, {
    key: 'centroid',
    value: function centroid() {
      if (this.isTriangle()) {
        var A = this.v(1).elements;
        var B = this.v(2).elements;
        var C = this.v(3).elements;
        return _vector.Vector.create([(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3]);
      }

      var V = _vector.Vector.Zero(3);
      var trigs = this.trianglesForSurfaceIntegral();
      var M = 0;
      var i = trigs.length;
      while (i--) {
        var _A = trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
        M += _A;
        var P = V.elements;
        var _C = trigs[i].centroid().elements;

        V.setElements([P[0] + _C[0] * _A, P[1] + _C[1] * _A, P[2] + _C[2] * _A]);
      }

      return V.x(1 / M);
    }

    // Returns the polygon's projection on the given plane as another polygon

  }, {
    key: 'projectionOn',
    value: function projectionOn(plane) {
      var points = [];
      this.vertices.each(function (node) {
        points.push(plane.pointClosestTo(node.data));
      });
      return Polygon.create(points);
    }

    // Removes the given vertex from the polygon as long as it's not triangular.

  }, {
    key: 'removeVertex',
    value: function removeVertex(vertex) {
      if (this.isTriangle()) {
        return;
      }
      var node = this.nodeFor(vertex);
      if (node === null) {
        return null;
      }
      this.clearCache();

      // Previous and next entries in the main vertex list
      var prev = node.prev;

      var next = node.next;
      var prevWasConvex = prev.data.isConvex(this);
      var nextWasConvex = next.data.isConvex(this);
      if (node.data.isConvex(this)) {
        this.convexVertices.remove(this.convexVertices.withData(node.data));
      } else {
        this.reflexVertices.remove(this.reflexVertices.withData(node.data));
      }
      this.vertices.remove(node);
      // Deal with previous vertex's change of class
      if (prevWasConvex !== prev.data.isConvex(this)) {
        if (prevWasConvex) {
          this.convexVertices.remove(this.convexVertices.withData(prev.data));
          this.reflexVertices.append(new _linkedlist.LinkedList.Node(prev.data));
        } else {
          this.reflexVertices.remove(this.reflexVertices.withData(prev.data));
          this.convexVertices.append(new _linkedlist.LinkedList.Node(prev.data));
        }
      }
      // Deal with next vertex's change of class
      if (nextWasConvex !== next.data.isConvex(this)) {
        if (nextWasConvex) {
          this.convexVertices.remove(this.convexVertices.withData(next.data));
          this.reflexVertices.append(new _linkedlist.LinkedList.Node(next.data));
        } else {
          this.reflexVertices.remove(this.reflexVertices.withData(next.data));
          this.convexVertices.append(new _linkedlist.LinkedList.Node(next.data));
        }
      }
      return this;
    }

    // Returns true iff the point is strictly inside the polygon

  }, {
    key: 'contains',
    value: function contains(point) {
      return this.containsByWindingNumber(point);
    }

    // Returns true iff the given point is strictly inside the polygon using the winding number method

  }, {
    key: 'containsByWindingNumber',
    value: function containsByWindingNumber(point) {
      var P = point.elements || point;
      if (!this.plane.contains(P)) {
        return false;
      }
      if (this.hasEdgeContaining(P)) {
        return false;
      }

      var theta = 0;
      var loops = 0;
      var self = this;
      this.vertices.each(function (node) {
        var V = node.data.elements;
        var W = node.next.data.elements;
        var A = _vector.Vector.create([V[0] - P[0], V[1] - P[1], V[2] - (P[2] || 0)]);
        var B = _vector.Vector.create([W[0] - P[0], W[1] - P[1], W[2] - (P[2] || 0)]);
        var dt = A.angleFrom(B);
        if (dt === null || dt === 0) {
          return;
        }
        theta += (A.cross(B).isParallelTo(self.plane.normal) ? 1 : -1) * dt;
        if (theta >= 2 * Math.PI - _sylvester.Sylvester.precision) {
          loops++;
          theta -= 2 * Math.PI;
        }
        if (theta <= -2 * Math.PI + _sylvester.Sylvester.precision) {
          loops--;
          theta += 2 * Math.PI;
        }
      });
      return loops !== 0;
    }

    // Returns true if the given point lies on an edge of the polygon
    // May cause problems with 'hole-joining' edges

  }, {
    key: 'hasEdgeContaining',
    value: function hasEdgeContaining(point) {
      var P = point.elements || point;
      var success = false;
      this.vertices.each(function (node) {
        if (!success && _line.Line.Segment.create(node.data, node.next.data).contains(P)) {
          success = true;
        }
      });

      return success;
    }

    // Returns an array of 3-vertex polygons that the original has been split into
    // Stores the first calculation for faster retrieval later on

  }, {
    key: 'toTriangles',
    value: function toTriangles() {
      if (this.cached.triangles !== null) {
        return this.cached.triangles;
      }
      return this.setCache('triangles', this.triangulateByEarClipping());
    }

    // Implementation of ear clipping algorithm
    // Found in 'Triangulation by ear clipping', by David Eberly
    // at http://www.geometrictools.com
    // This will not deal with overlapping sections - contruct your polygons sensibly

  }, {
    key: 'triangulateByEarClipping',
    value: function triangulateByEarClipping() {
      var _this = this;

      var poly = this.dup();
      var triangles = [];

      while (!poly.isTriangle()) {
        var success = false;
        var trig = void 0;
        var mainNode = void 0;

        var _loop = function _loop() {
          success = true;
          // Ear tips must be convex vertices - let's pick one at random
          var convexNode = poly.convexVertices.randomNode();
          var mainNode = poly.vertices.withData(convexNode.data);
          // For convex vertices, this order will always be anticlockwise
          var trig = Polygon.create([mainNode.data, mainNode.next.data, mainNode.prev.data], _this.plane);
          // Now test whether any reflex vertices lie within the ear
          poly.reflexVertices.each(function (node) {
            // eslint-disable-line no-loop-func
            // Don't test points belonging to this triangle. node won't be
            // equal to convexNode as node is reflex and vertex is convex.
            if (node.data !== mainNode.prev.data && node.data !== mainNode.next.data) {
              if (trig.contains(node.data) || trig.hasEdgeContaining(node.data)) {
                success = false;
              }
            }
          });
        };

        while (!success) {
          _loop();
        }
        triangles.push(trig);
        poly.removeVertex(mainNode.data);
      }
      // Need to do this to renumber the remaining vertices
      triangles.push(Polygon.create(poly.vertices, this.plane));
      return triangles;
    }

    // Sets the polygon's vertices

  }, {
    key: 'setVertices',
    value: function setVertices(points, plane) {
      var pointSet = points.toArray ? points.toArray() : points;
      this.plane = plane && plane.normal ? plane.dup() : _plane.Plane.fromPoints(pointSet);
      if (this.plane === null) {
        return null;
      }
      this.vertices = new _linkedlist.LinkedList.Circular();

      // Construct linked list of vertices. If each point is already a polygon
      // vertex, we reference it rather than creating a new vertex.
      var i = pointSet.length;
      while (i--) {
        var newVertex = pointSet[i].isConvex ? pointSet[i] : new Polygon.Vertex(pointSet[i]);
        this.vertices.prepend(new _linkedlist.LinkedList.Node(newVertex));
      }
      this.clearCache();
      this.populateVertexTypeLists();
      return this;
    }

    // Constructs lists of convex and reflex vertices based on the main vertex list.

  }, {
    key: 'populateVertexTypeLists',
    value: function populateVertexTypeLists() {
      this.convexVertices = new _linkedlist.LinkedList.Circular();
      this.reflexVertices = new _linkedlist.LinkedList.Circular();
      var self = this;
      this.vertices.each(function (node) {
        // Split vertices into convex / reflex groups
        // The LinkedList.Node class wraps each vertex so it can belong to many linked lists.
        self[node.data.type(self) + 'Vertices'].append(new _linkedlist.LinkedList.Node(node.data));
      });
    }

    // Gives the polygon its own local set of vertex points, allowing it to be
    // transformed independently of polygons it may be sharing vertices with.

  }, {
    key: 'copyVertices',
    value: function copyVertices() {
      this.clearCache();
      this.vertices.each(function (node) {
        node.data = new Polygon.Vertex(node.data);
      });
      this.populateVertexTypeLists();
    }

    // Clear any cached properties

  }, {
    key: 'clearCache',
    value: function clearCache() {
      this.cached = {
        triangles: null,
        surfaceIntegralElements: null
      };
    }

    // Set cached value and return the value

  }, {
    key: 'setCache',
    value: function setCache(key, value) {
      this.cached[key] = value;
      return value;
    }

    // Returns a string representation of the polygon's vertices.

  }, {
    key: 'inspect',
    value: function inspect() {
      var points = [];
      this.vertices.each(function (node) {
        points.push(node.data.inspect());
      });
      return points.join(' -> ');
    }

    // Constructor function

  }], [{
    key: 'create',
    value: function create(points, plane) {
      var P = new Polygon();
      return P.setVertices(points, plane);
    }
  }]);

  return Polygon;
}();

var Vertex = exports.Vertex = function (_Vector) {
  _inherits(Vertex, _Vector);

  function Vertex(point) {
    _classCallCheck(this, Vertex);

    var _this2 = _possibleConstructorReturn(this, (Vertex.__proto__ || Object.getPrototypeOf(Vertex)).call(this));

    _this2.setElements(point);
    if (_this2.elements.length === 2) {
      _this2.elements.push(0);
    }
    if (_this2.elements.length !== 3) {
      var _ret2;

      return _ret2 = null, _possibleConstructorReturn(_this2, _ret2);
    }
    return _this2;
  }

  // Returns true iff the vertex's internal angle is 0 <= x < 180
  // in the context of the given polygon object. Returns null if the
  // vertex does not exist in the polygon.


  _createClass(Vertex, [{
    key: 'isConvex',
    value: function isConvex(polygon) {
      var node = polygon.nodeFor(this);
      if (node === null) {
        return null;
      }
      var prev = node.prev.data;
      var next = node.next.data;
      var A = next.subtract(this);
      var B = prev.subtract(this);
      var theta = A.angleFrom(B);
      if (theta <= _sylvester.Sylvester.precision) {
        return true;
      }
      if (Math.abs(theta - Math.PI) <= _sylvester.Sylvester.precision) {
        return false;
      }
      return A.cross(B).dot(polygon.plane.normal) > 0;
    }

    // Returns true iff the vertex's internal angle is 180 <= x < 360

  }, {
    key: 'isReflex',
    value: function isReflex(polygon) {
      var result = this.isConvex(polygon);
      return result === null ? null : !result;
    }
  }, {
    key: 'type',
    value: function type(polygon) {
      var result = this.isConvex(polygon);
      return result === null ? null : result ? 'convex' : 'reflex';
    }

    // Method for converting a set of arrays/vectors/whatever to a set of Vertex objects

  }], [{
    key: 'convert',
    value: function convert(points) {
      var pointSet = points.toArray ? points.toArray() : points;
      var list = [];
      var n = pointSet.length;
      for (var i = 0; i < n; i++) {
        list.push(new Vertex(pointSet[i]));
      }
      return list;
    }
  }]);

  return Vertex;
}(_vector.Vector);

Polygon.Vertex = Vertex;