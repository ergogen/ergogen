import { Line } from './line';
import { LinkedList } from './linkedlist';
import { Matrix } from './matrix';
import { Plane } from './plane';
import { Sylvester } from './sylvester';
import { Vector } from './vector';

export class Polygon {
  // Returns the vertex at the given position on the vertex list, numbered from 1.
  v(i) {
    return this.vertices.at(i - 1).data;
  }

  // Returns the node in the vertices linked list that refers to the given vertex.
  nodeFor(vertex) {
    return this.vertices.withData(vertex);
  }

  // Returns a new polygon with the same vertices as the receiver. The vertices
  // will not be duplicates, they refer to the same objects as the vertices in this
  // polygon, but the linked list and nodes used to point to them are separate and
  // can be manipulated independently of this one.
  dup() {
    return Polygon.create(this.vertices, this.plane);
  }

  // Translates the polygon by the given vector and returns the polygon.
  translate(vector) {
    const P = vector.elements || vector;
    this.vertices.each(node => {
      const E = node.data.elements;
      node.data.setElements([E[0] + P[0], E[1] + P[1], E[2] + (P[2] || 0)]);
    });
    this.plane = this.plane.translate(vector);
    this.updateTrianglePlanes(plane => {
      return plane.translate(vector);
    });
    return this;
  }

  // Rotates the polygon about the given line and returns the polygon.
  rotate(t, line) {
    const R = Matrix.Rotation(t, line.direction);
    this.vertices.each(node => {
      node.data.setElements(node.data.rotate(R, line).elements);
    });
    this.plane = this.plane.rotate(R, line);
    this.updateTrianglePlanes(plane => {
      return plane.rotate(R, line);
    });
    return this;
  }

  // Scales the polygon relative to the given point and returns the polygon.
  scale(k, point) {
    const P = point.elements || point;
    this.vertices.each(node => {
      const E = node.data.elements;
      node.data.setElements([
        P[0] + (k * (E[0] - P[0])),
        P[1] + (k * (E[1] - P[1])),
        (P[2] || 0) + (k * (E[2] - (P[2] || 0)))
      ]);
    });
    const anchor = this.vertices.first.data;
    this.plane.anchor.setElements(anchor);
    this.updateTrianglePlanes(plane => {
      return Plane.create(anchor, plane.normal);
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
  updateTrianglePlanes(fn) {
    let i;
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
  isTriangle() {
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
  trianglesForSurfaceIntegral() {
    if (this.cached.surfaceIntegralElements !== null) {
      return this.cached.surfaceIntegralElements;
    }
    const triangles = [];
    const firstVertex = this.vertices.first.data;
    const plane = this.plane;
    this.vertices.each((node, i) => {
      if (i < 2) {
        return;
      }
      const points = [firstVertex, node.prev.data, node.data];
      // If the vertices lie on a straigh line, give the polygon's own plane. If the
      // element has no area, it doesn't matter which way its normal faces.
      triangles.push(Polygon.create(points, Plane.fromPoints(points) || plane));
    });
    return this.setCache('surfaceIntegralElements', triangles);
  }

  // Returns the area of the polygon. Requires that the polygon
  // be converted to triangles, so use with caution.
  area() {
    if (this.isTriangle()) {
      // Area is half the modulus of the cross product of two sides
      let A = this.vertices.first;
      let B = A.next;
      let C = B.next;
      A = A.data.elements;
      B = B.data.elements;
      C = C.data.elements;

      return 0.5 * Vector.create([
        ((A[1] - B[1]) * (C[2] - B[2])) - ((A[2] - B[2]) * (C[1] - B[1])),
        ((A[2] - B[2]) * (C[0] - B[0])) - ((A[0] - B[0]) * (C[2] - B[2])),
        ((A[0] - B[0]) * (C[1] - B[1])) - ((A[1] - B[1]) * (C[0] - B[0]))
      ]).modulus();
    }

    const trigs = this.trianglesForSurfaceIntegral();
    let area = 0;
    for (let i = 0; i < trigs.length; i++) {
      area += trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
    }

    return area;
  }

  // Returns the centroid of the polygon. Requires division into
  // triangles - use with caution
  centroid() {
    if (this.isTriangle()) {
      const A = this.v(1).elements;
      const B = this.v(2).elements;
      const C = this.v(3).elements;
      return Vector.create([
        (A[0] + B[0] + C[0]) / 3,
        (A[1] + B[1] + C[1]) / 3,
        (A[2] + B[2] + C[2]) / 3
      ]);
    }

    const V = Vector.Zero(3);
    const trigs = this.trianglesForSurfaceIntegral();
    let M = 0;
    let i = trigs.length;
    while (i--) {
      const A = trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
      M += A;
      const P = V.elements;
      const C = trigs[i].centroid().elements;

      V.setElements([
        P[0] + (C[0] * A),
        P[1] + (C[1] * A),
        P[2] + (C[2] * A)
      ]);
    }

    return V.x(1 / M);
  }

  // Returns the polygon's projection on the given plane as another polygon
  projectionOn(plane) {
    const points = [];
    this.vertices.each(node => {
      points.push(plane.pointClosestTo(node.data));
    });
    return Polygon.create(points);
  }

  // Removes the given vertex from the polygon as long as it's not triangular.
  removeVertex(vertex) {
    if (this.isTriangle()) {
      return;
    }
    const node = this.nodeFor(vertex);
    if (node === null) {
      return null;
    }
    this.clearCache();

    // Previous and next entries in the main vertex list
    const prev = node.prev;

    const next = node.next;
    const prevWasConvex = prev.data.isConvex(this);
    const nextWasConvex = next.data.isConvex(this);
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
        this.reflexVertices.append(new LinkedList.Node(prev.data));
      } else {
        this.reflexVertices.remove(this.reflexVertices.withData(prev.data));
        this.convexVertices.append(new LinkedList.Node(prev.data));
      }
    }
    // Deal with next vertex's change of class
    if (nextWasConvex !== next.data.isConvex(this)) {
      if (nextWasConvex) {
        this.convexVertices.remove(this.convexVertices.withData(next.data));
        this.reflexVertices.append(new LinkedList.Node(next.data));
      } else {
        this.reflexVertices.remove(this.reflexVertices.withData(next.data));
        this.convexVertices.append(new LinkedList.Node(next.data));
      }
    }
    return this;
  }

  // Returns true iff the point is strictly inside the polygon
  contains(point) {
    return this.containsByWindingNumber(point);
  }

  // Returns true iff the given point is strictly inside the polygon using the winding number method
  containsByWindingNumber(point) {
    const P = point.elements || point;
    if (!this.plane.contains(P)) {
      return false;
    }
    if (this.hasEdgeContaining(P)) {
      return false;
    }

    let theta = 0;
    let loops = 0;
    const self = this;
    this.vertices.each(node => {
      const V = node.data.elements;
      const W = node.next.data.elements;
      const A = Vector.create([V[0] - P[0], V[1] - P[1], V[2] - (P[2] || 0)]);
      const B = Vector.create([W[0] - P[0], W[1] - P[1], W[2] - (P[2] || 0)]);
      const dt = A.angleFrom(B);
      if (dt === null || dt === 0) {
        return;
      }
      theta += (A.cross(B).isParallelTo(self.plane.normal) ? 1 : -1) * dt;
      if (theta >= (2 * Math.PI) - Sylvester.precision) {
        loops++;
        theta -= 2 * Math.PI;
      }
      if (theta <= (-2 * Math.PI) + Sylvester.precision) {
        loops--;
        theta += 2 * Math.PI;
      }
    });
    return loops !== 0;
  }

  // Returns true if the given point lies on an edge of the polygon
  // May cause problems with 'hole-joining' edges
  hasEdgeContaining(point) {
    const P = (point.elements || point);
    let success = false;
    this.vertices.each(node => {
      if (!success && Line.Segment.create(node.data, node.next.data).contains(P)) {
        success = true;
      }
    });

    return success;
  }

  // Returns an array of 3-vertex polygons that the original has been split into
  // Stores the first calculation for faster retrieval later on
  toTriangles() {
    if (this.cached.triangles !== null) {
      return this.cached.triangles;
    }
    return this.setCache('triangles', this.triangulateByEarClipping());
  }

  // Implementation of ear clipping algorithm
  // Found in 'Triangulation by ear clipping', by David Eberly
  // at http://www.geometrictools.com
  // This will not deal with overlapping sections - contruct your polygons sensibly
  triangulateByEarClipping() {
    const poly = this.dup();
    const triangles = [];

    while (!poly.isTriangle()) {
      let success = false;
      let trig;
      let mainNode;
      while (!success) {
        success = true;
        // Ear tips must be convex vertices - let's pick one at random
        const convexNode = poly.convexVertices.randomNode();
        const mainNode = poly.vertices.withData(convexNode.data);
        // For convex vertices, this order will always be anticlockwise
        const trig = Polygon.create([mainNode.data, mainNode.next.data, mainNode.prev.data], this.plane);
        // Now test whether any reflex vertices lie within the ear
        poly.reflexVertices.each(node => { // eslint-disable-line no-loop-func
          // Don't test points belonging to this triangle. node won't be
          // equal to convexNode as node is reflex and vertex is convex.
          if (node.data !== mainNode.prev.data && node.data !== mainNode.next.data) {
            if (trig.contains(node.data) || trig.hasEdgeContaining(node.data)) {
              success = false;
            }
          }
        });
      }
      triangles.push(trig);
      poly.removeVertex(mainNode.data);
    }
    // Need to do this to renumber the remaining vertices
    triangles.push(Polygon.create(poly.vertices, this.plane));
    return triangles;
  }

  // Sets the polygon's vertices
  setVertices(points, plane) {
    const pointSet = points.toArray ? points.toArray() : points;
    this.plane = (plane && plane.normal) ? plane.dup() : Plane.fromPoints(pointSet);
    if (this.plane === null) {
      return null;
    }
    this.vertices = new LinkedList.Circular();

    // Construct linked list of vertices. If each point is already a polygon
    // vertex, we reference it rather than creating a new vertex.
    let i = pointSet.length;
    while (i--) {
      const newVertex = pointSet[i].isConvex ? pointSet[i] : new Polygon.Vertex(pointSet[i]);
      this.vertices.prepend(new LinkedList.Node(newVertex));
    }
    this.clearCache();
    this.populateVertexTypeLists();
    return this;
  }

  // Constructs lists of convex and reflex vertices based on the main vertex list.
  populateVertexTypeLists() {
    this.convexVertices = new LinkedList.Circular();
    this.reflexVertices = new LinkedList.Circular();
    const self = this;
    this.vertices.each(node => {
      // Split vertices into convex / reflex groups
      // The LinkedList.Node class wraps each vertex so it can belong to many linked lists.
      self[`${node.data.type(self)}Vertices`].append(new LinkedList.Node(node.data));
    });
  }

  // Gives the polygon its own local set of vertex points, allowing it to be
  // transformed independently of polygons it may be sharing vertices with.
  copyVertices() {
    this.clearCache();
    this.vertices.each(node => {
      node.data = new Polygon.Vertex(node.data);
    });
    this.populateVertexTypeLists();
  }

  // Clear any cached properties
  clearCache() {
    this.cached = {
      triangles: null,
      surfaceIntegralElements: null
    };
  }

  // Set cached value and return the value
  setCache(key, value) {
    this.cached[key] = value;
    return value;
  }

  // Returns a string representation of the polygon's vertices.
  inspect() {
    const points = [];
    this.vertices.each(node => {
      points.push(node.data.inspect());
    });
    return points.join(' -> ');
  }

  // Constructor function
  static create(points, plane) {
    const P = new Polygon();
    return P.setVertices(points, plane);
  }
}

export class Vertex extends Vector {
  constructor(point) {
    super();

    this.setElements(point);
    if (this.elements.length === 2) {
      this.elements.push(0);
    }
    if (this.elements.length !== 3) {
      return null;
    }
  }

  // Returns true iff the vertex's internal angle is 0 <= x < 180
  // in the context of the given polygon object. Returns null if the
  // vertex does not exist in the polygon.
  isConvex(polygon) {
    const node = polygon.nodeFor(this);
    if (node === null) {
      return null;
    }
    const prev = node.prev.data;
    const next = node.next.data;
    const A = next.subtract(this);
    const B = prev.subtract(this);
    const theta = A.angleFrom(B);
    if (theta <= Sylvester.precision) {
      return true;
    }
    if (Math.abs(theta - Math.PI) <= Sylvester.precision) {
      return false;
    }
    return (A.cross(B).dot(polygon.plane.normal) > 0);
  }

  // Returns true iff the vertex's internal angle is 180 <= x < 360
  isReflex(polygon) {
    const result = this.isConvex(polygon);
    return (result === null) ? null : !result;
  }

  type(polygon) {
    const result = this.isConvex(polygon);
    return (result === null) ? null : (result ? 'convex' : 'reflex');
  }

  // Method for converting a set of arrays/vectors/whatever to a set of Vertex objects
  static convert(points) {
    const pointSet = points.toArray ? points.toArray() : points;
    const list = [];
    const n = pointSet.length;
    for (let i = 0; i < n; i++) {
      list.push(new Vertex(pointSet[i]));
    }
    return list;
  }
}

Polygon.Vertex = Vertex;
