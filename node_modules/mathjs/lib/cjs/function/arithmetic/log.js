"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLog = void 0;

var _factory = require("../../utils/factory.js");

var _collection = require("../../utils/collection.js");

var _index = require("../../plain/number/index.js");

var name = 'log';
var dependencies = ['config', 'typed', 'divideScalar', 'Complex'];
var createLog = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      divideScalar = _ref.divideScalar,
      Complex = _ref.Complex;

  /**
   * Calculate the logarithm of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log(x)
   *    math.log(x, base)
   *
   * Examples:
   *
   *    math.log(3.5)                  // returns 1.252762968495368
   *    math.exp(math.log(2.4))        // returns 2.4
   *
   *    math.pow(10, 4)                // returns 10000
   *    math.log(10000, 10)            // returns 4
   *    math.log(10000) / math.log(10) // returns 4
   *
   *    math.log(1024, 2)              // returns 10
   *    math.pow(2, 10)                // returns 1024
   *
   * See also:
   *
   *    exp, log2, log10, log1p
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @param {number | BigNumber | Complex} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x` is calculated.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the logarithm of `x`
   */
  return typed(name, {
    number: function number(x) {
      if (x >= 0 || config.predictable) {
        return (0, _index.logNumber)(x);
      } else {
        // negative value -> complex value computation
        return new Complex(x, 0).log();
      }
    },
    Complex: function Complex(x) {
      return x.log();
    },
    BigNumber: function BigNumber(x) {
      if (!x.isNegative() || config.predictable) {
        return x.ln();
      } else {
        // downgrade to number, return Complex valued result
        return new Complex(x.toNumber(), 0).log();
      }
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return (0, _collection.deepMap)(x, this);
    },
    'any, any': function anyAny(x, base) {
      // calculate logarithm for a specified base, log(x, base)
      return divideScalar(this(x), this(base));
    }
  });
});
exports.createLog = createLog;