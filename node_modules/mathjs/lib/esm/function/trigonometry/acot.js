import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { acotNumber } from '../../plain/number/index.js';
var name = 'acot';
var dependencies = ['typed', 'BigNumber'];
export var createAcot = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    BigNumber: _BigNumber
  } = _ref;

  /**
   * Calculate the inverse cotangent of a value, defined as `acot(x) = atan(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acot(x)
   *
   * Examples:
   *
   *    math.acot(0.5)           // returns number 0.4636476090008061
   *    math.acot(math.cot(1.5)) // returns number 1.5
   *
   *    math.acot(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    cot, atan
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cotangent of x
   */
  return typed(name, {
    number: acotNumber,
    Complex: function Complex(x) {
      return x.acot();
    },
    BigNumber: function BigNumber(x) {
      return new _BigNumber(1).div(x).atan();
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});