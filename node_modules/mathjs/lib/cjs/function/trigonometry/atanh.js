"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAtanh = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'atanh';
var dependencies = ['typed', 'config', 'Complex'];
var createAtanh = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      Complex = _ref.Complex;

  /**
   * Calculate the hyperbolic arctangent of a value,
   * defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atanh(x)
   *
   * Examples:
   *
   *    math.atanh(0.5)       // returns 0.5493061443340549
   *
   * See also:
   *
   *    acosh, asinh
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  return typed(name, {
    number: function number(x) {
      if (x <= 1 && x >= -1 || config.predictable) {
        return (0, _index.atanhNumber)(x);
      }

      return new Complex(x, 0).atanh();
    },
    Complex: function Complex(x) {
      return x.atanh();
    },
    BigNumber: function BigNumber(x) {
      return x.atanh();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since atanh(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    }
  });
});
exports.createAtanh = createAtanh;