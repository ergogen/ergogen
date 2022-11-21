"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGamma = void 0;

var _collection = require("../../utils/collection.js");

var _factory = require("../../utils/factory.js");

var _index = require("../../plain/number/index.js");

var name = 'gamma';
var dependencies = ['typed', 'config', 'multiplyScalar', 'pow', 'BigNumber', 'Complex'];
var createGamma = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      multiplyScalar = _ref.multiplyScalar,
      pow = _ref.pow,
      _BigNumber = _ref.BigNumber,
      _Complex = _ref.Complex;

  /**
   * Compute the gamma function of a value using Lanczos approximation for
   * small values, and an extended Stirling approximation for large values.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.gamma(n)
   *
   * Examples:
   *
   *    math.gamma(5)       // returns 24
   *    math.gamma(-0.5)    // returns -3.5449077018110335
   *    math.gamma(math.i)  // returns -0.15494982830180973 - 0.49801566811835596i
   *
   * See also:
   *
   *    combinations, factorial, permutations
   *
   * @param {number | Array | Matrix} n   A real or complex number
   * @return {number | Array | Matrix}    The gamma of `n`
   */
  return typed(name, {
    number: _index.gammaNumber,
    Complex: function Complex(n) {
      if (n.im === 0) {
        return this(n.re);
      }

      n = new _Complex(n.re - 1, n.im);
      var x = new _Complex(_index.gammaP[0], 0);

      for (var i = 1; i < _index.gammaP.length; ++i) {
        var real = n.re + i; // x += p[i]/(n+i)

        var den = real * real + n.im * n.im;

        if (den !== 0) {
          x.re += _index.gammaP[i] * real / den;
          x.im += -(_index.gammaP[i] * n.im) / den;
        } else {
          x.re = _index.gammaP[i] < 0 ? -Infinity : Infinity;
        }
      }

      var t = new _Complex(n.re + _index.gammaG + 0.5, n.im);
      var twoPiSqrt = Math.sqrt(2 * Math.PI);
      n.re += 0.5;
      var result = pow(t, n);

      if (result.im === 0) {
        // sqrt(2*PI)*result
        result.re *= twoPiSqrt;
      } else if (result.re === 0) {
        result.im *= twoPiSqrt;
      } else {
        result.re *= twoPiSqrt;
        result.im *= twoPiSqrt;
      }

      var r = Math.exp(-t.re); // exp(-t)

      t.re = r * Math.cos(-t.im);
      t.im = r * Math.sin(-t.im);
      return multiplyScalar(multiplyScalar(result, t), x);
    },
    BigNumber: function BigNumber(n) {
      if (n.isInteger()) {
        return n.isNegative() || n.isZero() ? new _BigNumber(Infinity) : bigFactorial(n.minus(1));
      }

      if (!n.isFinite()) {
        return new _BigNumber(n.isNegative() ? NaN : Infinity);
      }

      throw new Error('Integer BigNumber expected');
    },
    'Array | Matrix': function ArrayMatrix(n) {
      return (0, _collection.deepMap)(n, this);
    }
  });
  /**
   * Calculate factorial for a BigNumber
   * @param {BigNumber} n
   * @returns {BigNumber} Returns the factorial of n
   */

  function bigFactorial(n) {
    if (n < 8) {
      return new _BigNumber([1, 1, 2, 6, 24, 120, 720, 5040][n]);
    }

    var precision = config.precision + (Math.log(n.toNumber()) | 0);

    var Big = _BigNumber.clone({
      precision: precision
    });

    if (n % 2 === 1) {
      return n.times(bigFactorial(new _BigNumber(n - 1)));
    }

    var p = n;
    var prod = new Big(n);
    var sum = n.toNumber();

    while (p > 2) {
      p -= 2;
      sum += p;
      prod = prod.times(sum);
    }

    return new _BigNumber(prod.toPrecision(_BigNumber.precision));
  }
});
exports.createGamma = createGamma;