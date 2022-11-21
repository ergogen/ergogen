"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExp = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'exp';
var dependencies = ['typed'];
var createExp = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Calculate the exponent of a value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.exp(x)
   *
   * Examples:
   *
   *    math.exp(2)                  // returns number 7.3890560989306495
   *    math.pow(math.e, 2)          // returns number 7.3890560989306495
   *    math.log(math.exp(2))        // returns number 2
   *
   *    math.exp([1, 2, 3])
   *    // returns Array [
   *    //   2.718281828459045,
   *    //   7.3890560989306495,
   *    //   20.085536923187668
   *    // ]
   *
   * See also:
   *
   *    expm1, log, pow
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  A number or matrix to exponentiate
   * @return {number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  return typed(name, {
    number: _index.expNumber,
    Complex: function Complex(x) {
      return x.exp();
    },
    BigNumber: function BigNumber(x) {
      return x.exp();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // TODO: exp(sparse) should return a dense matrix since exp(0)==1
      return (0, _collection.deepMap)(x, this);
    }
  });
});
exports.createExp = createExp;