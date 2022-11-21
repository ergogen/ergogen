"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSqrt = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var name = 'sqrt';
var dependencies = ['config', 'typed', 'Complex'];
var createSqrt = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var config = _ref.config,
      typed = _ref.typed,
      Complex = _ref.Complex;

  /**
   * Calculate the square root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sqrt(x)
   *
   * Examples:
   *
   *    math.sqrt(25)                // returns 5
   *    math.square(5)               // returns 25
   *    math.sqrt(-4)                // returns Complex 2i
   *
   * See also:
   *
   *    square, multiply, cube, cbrt, sqrtm
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Unit} x
   *            Value for which to calculate the square root.
   * @return {number | BigNumber | Complex | Array | Matrix | Unit}
   *            Returns the square root of `x`
   */
  return typed('sqrt', {
    number: _sqrtNumber,
    Complex: function Complex(x) {
      return x.sqrt();
    },
    BigNumber: function BigNumber(x) {
      if (!x.isNegative() || config.predictable) {
        return x.sqrt();
      } else {
        // negative value -> downgrade to number to do complex value computation
        return _sqrtNumber(x.toNumber());
      }
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    },
    Unit: function Unit(x) {
      // Someday will work for complex units when they are implemented
      return x.pow(0.5);
    }
  });
  /**
   * Calculate sqrt for a number
   * @param {number} x
   * @returns {number | Complex} Returns the square root of x
   * @private
   */

  function _sqrtNumber(x) {
    if (isNaN(x)) {
      return NaN;
    } else if (x >= 0 || config.predictable) {
      return Math.sqrt(x);
    } else {
      return new Complex(x, 0).sqrt();
    }
  }
});
exports.createSqrt = createSqrt;