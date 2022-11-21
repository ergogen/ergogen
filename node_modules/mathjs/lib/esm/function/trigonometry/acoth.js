import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { acothNumber } from '../../plain/number/index.js';
var name = 'acoth';
var dependencies = ['typed', 'config', 'Complex', 'BigNumber'];
export var createAcoth = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    config,
    Complex,
    BigNumber: _BigNumber
  } = _ref;

  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5)       // returns 0.8047189562170503
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  return typed(name, {
    number: function number(x) {
      if (x >= 1 || x <= -1 || config.predictable) {
        return acothNumber(x);
      }

      return new Complex(x, 0).acoth();
    },
    Complex: function Complex(x) {
      return x.acoth();
    },
    BigNumber: function BigNumber(x) {
      return new _BigNumber(1).div(x).atanh();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});