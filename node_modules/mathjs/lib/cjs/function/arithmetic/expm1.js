"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExpm1 = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'expm1';
var dependencies = ['typed', 'Complex'];
var createExpm1 = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      _Complex = _ref.Complex;

  /**
   * Calculate the value of subtracting 1 from the exponential value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.expm1(x)
   *
   * Examples:
   *
   *    math.expm1(2)                      // returns number 6.38905609893065
   *    math.pow(math.e, 2) - 1            // returns number 6.3890560989306495
   *    math.log(math.expm1(2) + 1)        // returns number 2
   *
   *    math.expm1([1, 2, 3])
   *    // returns Array [
   *    //   1.718281828459045,
   *    //   6.3890560989306495,
   *    //   19.085536923187668
   *    // ]
   *
   * See also:
   *
   *    exp, log, pow
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  A number or matrix to apply expm1
   * @return {number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  return typed(name, {
    number: _index.expm1Number,
    Complex: function Complex(x) {
      var r = Math.exp(x.re);
      return new _Complex(r * Math.cos(x.im) - 1, r * Math.sin(x.im));
    },
    BigNumber: function BigNumber(x) {
      return x.exp().minus(1);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return (0, _collection.deepMap)(x, this);
    }
  });
});
exports.createExpm1 = createExpm1;