import { factory } from '../../utils/factory.js';
import { multiplyNumber } from '../../plain/number/index.js';
var name = 'multiplyScalar';
var dependencies = ['typed'];
export var createMultiplyScalar = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed
  } = _ref;

  /**
   * Multiply two scalar values, `x * y`.
   * This function is meant for internal use: it is used by the public function
   * `multiply`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to multiply
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to multiply
   * @return {number | BigNumber | Fraction | Complex | Unit}     Multiplication of `x` and `y`
   * @private
   */
  return typed('multiplyScalar', {
    'number, number': multiplyNumber,
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.mul(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.times(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.mul(y);
    },
    'number | Fraction | BigNumber | Complex, Unit': function numberFractionBigNumberComplexUnit(x, y) {
      var res = y.clone();
      res.value = res.value === null ? res._normalize(x) : this(res.value, x);
      return res;
    },
    'Unit, number | Fraction | BigNumber | Complex': function UnitNumberFractionBigNumberComplex(x, y) {
      var res = x.clone();
      res.value = res.value === null ? res._normalize(y) : this(res.value, y);
      return res;
    },
    'Unit, Unit': function UnitUnit(x, y) {
      return x.multiply(y);
    }
  });
});