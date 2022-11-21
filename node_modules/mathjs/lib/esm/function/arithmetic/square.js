import { factory } from '../../utils/factory.js';
import { deepMap } from '../../utils/collection.js';
import { squareNumber } from '../../plain/number/index.js';
var name = 'square';
var dependencies = ['typed'];
export var createSquare = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed
  } = _ref;

  /**
   * Compute the square of a value, `x * x`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.square(x)
   *
   * Examples:
   *
   *    math.square(2)           // returns number 4
   *    math.square(3)           // returns number 9
   *    math.pow(3, 2)           // returns number 9
   *    math.multiply(3, 3)      // returns number 9
   *
   *    math.square([1, 2, 3, 4])  // returns Array [1, 4, 9, 16]
   *
   * See also:
   *
   *    multiply, cube, sqrt, pow
   *
   * @param  {number | BigNumber | Fraction | Complex | Array | Matrix | Unit} x
   *            Number for which to calculate the square
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix | Unit}
   *            Squared value
   */
  return typed(name, {
    number: squareNumber,
    Complex: function Complex(x) {
      return x.mul(x);
    },
    BigNumber: function BigNumber(x) {
      return x.times(x);
    },
    Fraction: function Fraction(x) {
      return x.mul(x);
    },
    'Array | Matrix': function ArrayMatrix(x) {
      // deep map collection, skip zeros since square(0) = 0
      return deepMap(x, this, true);
    },
    Unit: function Unit(x) {
      return x.pow(2);
    }
  });
});