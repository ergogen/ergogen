"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTanh = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _number = require("../../utils/number.js");

var name = 'tanh';
var dependencies = ['typed'];
var createTanh = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5)                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5)  // returns 0.46211715726000974
   *    1 / math.coth(0.5)               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic tangent of x
   */
  return typed('tanh', {
    number: _number.tanh,
    Complex: function Complex(x) {
      return x.tanh();
    },
    BigNumber: function BigNumber(x) {
      return x.tanh();
    },
    Unit: function Unit(x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function tanh is no angle');
      }

      return this(x.value);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since tanh(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    }
  });
});
exports.createTanh = createTanh;