"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSign = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'sign';
var dependencies = ['typed', 'BigNumber', 'Fraction', 'complex'];
var createSign = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      _BigNumber = _ref.BigNumber,
      complex = _ref.complex,
      _Fraction = _ref.Fraction;

  /**
   * Compute the sign of a value. The sign of a value x is:
   *
   * -  1 when x > 0
   * - -1 when x < 0
   * -  0 when x == 0
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sign(x)
   *
   * Examples:
   *
   *    math.sign(3.5)               // returns 1
   *    math.sign(-4.2)              // returns -1
   *    math.sign(0)                 // returns 0
   *
   *    math.sign([3, 5, -2, 0, 2])  // returns [1, 1, -1, 0, 1]
   *
   * See also:
   *
   *    abs
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            The number for which to determine the sign
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}e
   *            The sign of `x`
   */
  return typed(name, {
    number: _index.signNumber,
    Complex: function Complex(x) {
      return x.im === 0 ? complex((0, _index.signNumber)(x.re)) : x.sign();
    },
    BigNumber: function BigNumber(x) {
      return new _BigNumber(x.cmp(0));
    },
    Fraction: function Fraction(x) {
      return new _Fraction(x.s, 1);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since sign(0) = 0
      return (0, _collection.deepMap)(x, this, true);
    },
    Unit: function Unit(x) {
      return this(x.value);
    }
  });
});
exports.createSign = createSign;