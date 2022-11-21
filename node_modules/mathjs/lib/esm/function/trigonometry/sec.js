import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { secNumber } from '../../plain/number/index.js';
var name = 'sec';
var dependencies = ['typed', 'BigNumber'];
export var createSec = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    BigNumber: _BigNumber
  } = _ref;

  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2)      // returns number -2.4029979617223822
   *    1 / math.cos(2)  // returns number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Secant of x
   */
  return typed(name, {
    number: secNumber,
    Complex: function Complex(x) {
      return x.sec();
    },
    BigNumber: function BigNumber(x) {
      return new _BigNumber(1).div(x.cos());
    },
    Unit: function Unit(x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function sec is no angle');
      }

      return this(x.value);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      return deepMap(x, this);
    }
  });
});