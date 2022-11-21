import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { expm1Number } from '../../plain/number/index.js';
var name = 'expm1';
var dependencies = ['typed', 'Complex'];
export var createExpm1 = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    Complex: _Complex
  } = _ref;

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
    number: expm1Number,
    Complex: function Complex(x) {
      var r = Math.exp(x.re);
      return new _Complex(r * Math.cos(x.im) - 1, r * Math.sin(x.im));
    },
    BigNumber: function BigNumber(x) {
      return x.exp().minus(1);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});