import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { acoshNumber } from '../../plain/number/index.js';
var name = 'acosh';
var dependencies = ['typed', 'config', 'Complex'];
export var createAcosh = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    config,
    Complex
  } = _ref;

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acosh(x)
   *
   * Examples:
   *
   *    math.acosh(1.5)       // returns 0.9624236501192069
   *
   * See also:
   *
   *    cosh, asinh, atanh
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccosine of x
   */
  return typed(name, {
    number: function number(x) {
      if (x >= 1 || config.predictable) {
        return acoshNumber(x);
      }

      if (x <= -1) {
        return new Complex(Math.log(Math.sqrt(x * x - 1) - x), Math.PI);
      }

      return new Complex(x, 0).acosh();
    },
    Complex: function Complex(x) {
      return x.acosh();
    },
    BigNumber: function BigNumber(x) {
      return x.acosh();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});