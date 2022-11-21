"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCube = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'cube';
var dependencies = ['typed'];
var createCube = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Compute the cube of a value, `x * x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cube(x)
   *
   * Examples:
   *
   *    math.cube(2)            // returns number 8
   *    math.pow(2, 3)          // returns number 8
   *    math.cube(4)            // returns number 64
   *    4 * 4 * 4               // returns number 64
   *
   *    math.cube([1, 2, 3, 4]) // returns Array [1, 8, 27, 64]
   *
   * See also:
   *
   *    multiply, square, pow, cbrt
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x  Number for which to calculate the cube
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} Cube of x
   */
  return typed(name, {
    number: _index.cubeNumber,
    Complex: function Complex(x) {
      return x.mul(x).mul(x); // Is faster than pow(x, 3)
    },
    BigNumber: function BigNumber(x) {
      return x.times(x).times(x);
    },
    Fraction: function Fraction(x) {
      return x.pow(3); // Is faster than mul()mul()mul()
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since cube(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    },
    Unit: function Unit(x) {
      return x.pow(3);
    }
  });
});
exports.createCube = createCube;