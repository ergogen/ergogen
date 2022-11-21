"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAsin = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var name = 'asin';
var dependencies = ['typed', 'config', 'Complex'];
var createAsin = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      Complex = _ref.Complex;

  /**
   * Calculate the inverse sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asin(x)
   *
   * Examples:
   *
   *    math.asin(0.5)           // returns number 0.5235987755982989
   *    math.asin(math.sin(1.5)) // returns number ~1.5
   *
   *    math.asin(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    sin, atan, acos
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x   Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc sine of x
   */
  return typed(name, {
    number: function number(x) {
      if (x >= -1 && x <= 1 || config.predictable) {
        return Math.asin(x);
      } else {
        return new Complex(x, 0).asin();
      }
    },
    Complex: function Complex(x) {
      return x.asin();
    },
    BigNumber: function BigNumber(x) {
      return x.asin();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since asin(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    }
  });
});
exports.createAsin = createAsin;