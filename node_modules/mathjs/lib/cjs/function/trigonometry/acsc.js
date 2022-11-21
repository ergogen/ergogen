"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAcsc = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'acsc';
var dependencies = ['typed', 'config', 'Complex', 'BigNumber'];
var createAcsc = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      Complex = _ref.Complex,
      _BigNumber = _ref.BigNumber;

  /**
   * Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsc(x)
   *
   * Examples:
   *
   *    math.acsc(0.5)           // returns number 0.5235987755982989
   *    math.acsc(math.csc(1.5)) // returns number ~1.5
   *
   *    math.acsc(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    csc, asin, asec
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cosecant of x
   */
  return typed(name, {
    number: function number(x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return (0, _index.acscNumber)(x);
      }

      return new Complex(x, 0).acsc();
    },
    Complex: function Complex(x) {
      return x.acsc();
    },
    BigNumber: function BigNumber(x) {
      return new _BigNumber(1).div(x).asin();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return (0, _collection.deepMap)(x, this);
    }
  });
});
exports.createAcsc = createAcsc;