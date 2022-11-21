import { factory } from '../../utils/factory.js';
import { typeOf } from '../../utils/is.js';
var name = 'divideScalar';
var dependencies = ['typed', 'numeric'];
export var createDivideScalar = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    typed,
    numeric
  } = _ref;

  /**
   * Divide two scalar values, `x / y`.
   * This function is meant for internal use: it is used by the public functions
   * `divide` and `inv`.
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   Numerator
   * @param  {number | BigNumber | Fraction | Complex} y          Denominator
   * @return {number | BigNumber | Fraction | Complex | Unit}     Quotient, `x / y`
   * @private
   */
  return typed(name, {
    'number, number': function numberNumber(x, y) {
      return x / y;
    },
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.div(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.div(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.div(y);
    },
    'Unit, number | Fraction | BigNumber': function UnitNumberFractionBigNumber(x, y) {
      var res = x.clone(); // TODO: move the divide function to Unit.js, it uses internals of Unit

      var one = numeric(1, typeOf(y));
      res.value = this(res.value === null ? res._normalize(one) : res.value, y);
      return res;
    },
    'number | Fraction | BigNumber, Unit': function numberFractionBigNumberUnit(x, y) {
      var res = y.clone();
      res = res.pow(-1); // TODO: move the divide function to Unit.js, it uses internals of Unit

      var one = numeric(1, typeOf(x));
      res.value = this(x, y.value === null ? y._normalize(one) : y.value);
      return res;
    },
    'Unit, Unit': function UnitUnit(x, y) {
      return x.divide(y);
    }
  });
});