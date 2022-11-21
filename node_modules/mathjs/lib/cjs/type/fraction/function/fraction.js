"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFraction = void 0;

var _factory = require("../../../utils/factory.js");

var _collection = require("../../../utils/collection.js");

var name = 'fraction';
var dependencies = ['typed', 'Fraction'];
var createFraction = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      Fraction = _ref.Fraction;

  /**
   * Create a fraction convert a value to a fraction.
   *
   * Syntax:
   *     math.fraction(numerator, denominator)
   *     math.fraction({n: numerator, d: denominator})
   *     math.fraction(matrix: Array | Matrix)         Turn all matrix entries
   *                                                   into fractions
   *
   * Examples:
   *
   *     math.fraction(1, 3)
   *     math.fraction('2/3')
   *     math.fraction({n: 2, d: 3})
   *     math.fraction([0.2, 0.25, 1.25])
   *
   * See also:
   *
   *    bignumber, number, string, unit
   *
   * @param {number | string | Fraction | BigNumber | Array | Matrix} [args]
   *            Arguments specifying the numerator and denominator of
   *            the fraction
   * @return {Fraction | Array | Matrix} Returns a fraction
   */
  return typed('fraction', {
    number: function number(x) {
      if (!isFinite(x) || isNaN(x)) {
        throw new Error(x + ' cannot be represented as a fraction');
      }

      return new Fraction(x);
    },
    string: function string(x) {
      return new Fraction(x);
    },
    'number, number': function numberNumber(numerator, denominator) {
      return new Fraction(numerator, denominator);
    },
    "null": function _null(x) {
      return new Fraction(0);
    },
    BigNumber: function BigNumber(x) {
      return new Fraction(x.toString());
    },
    Fraction: function Fraction(x) {
      return x; // fractions are immutable
    },
    Object: function Object(x) {
      return new Fraction(x);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return (0, _collection.deepMap)(x, this);
    }
  });
});
exports.createFraction = createFraction;