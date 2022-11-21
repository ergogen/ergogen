"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFlatten = void 0;

var _object = require("../../utils/object.js");

var _array = require("../../utils/array.js");

var _factory = require("../../utils/factory.js");

var name = 'flatten';
var dependencies = ['typed', 'matrix'];
var createFlatten = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      matrix = _ref.matrix;

  /**
   * Flatten a multi dimensional matrix into a single dimensional matrix.
   * It is guaranteed to always return a clone of the argument.
   *
   * Syntax:
   *
   *    math.flatten(x)
   *
   * Examples:
   *
   *    math.flatten([[1,2], [3,4]])   // returns [1, 2, 3, 4]
   *
   * See also:
   *
   *    concat, resize, size, squeeze
   *
   * @param {Matrix | Array} x   Matrix to be flattened
   * @return {Matrix | Array} Returns the flattened matrix
   */
  return typed(name, {
    Array: function Array(x) {
      return (0, _array.flatten)((0, _object.clone)(x));
    },
    Matrix: function Matrix(x) {
      var flat = (0, _array.flatten)((0, _object.clone)(x.toArray())); // TODO: return the same matrix type as x

      return matrix(flat);
    }
  });
});
exports.createFlatten = createFlatten;