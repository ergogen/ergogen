"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRange = void 0;

var _factory = require("../../utils/factory.js");

var _noop = require("../../utils/noop.js");

var name = 'range';
var dependencies = ['typed', 'config', '?matrix', '?bignumber', 'smaller', 'smallerEq', 'larger', 'largerEq'];
var createRange = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      matrix = _ref.matrix,
      bignumber = _ref.bignumber,
      smaller = _ref.smaller,
      smallerEq = _ref.smallerEq,
      larger = _ref.larger,
      largerEq = _ref.largerEq;

  /**
   * Create an array from a range.
   * By default, the range end is excluded. This can be customized by providing
   * an extra parameter `includeEnd`.
   *
   * Syntax:
   *
   *     math.range(str [, includeEnd])               // Create a range from a string,
   *                                                  // where the string contains the
   *                                                  // start, optional step, and end,
   *                                                  // separated by a colon.
   *     math.range(start, end [, includeEnd])        // Create a range with start and
   *                                                  // end and a step size of 1.
   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
   *                                                  // and end.
   *
   * Where:
   *
   * - `str: string`
   *   A string 'start:end' or 'start:step:end'
   * - `start: {number | BigNumber}`
   *   Start of the range
   * - `end: number | BigNumber`
   *   End of the range, excluded by default, included when parameter includeEnd=true
   * - `step: number | BigNumber`
   *   Step size. Default value is 1.
   * - `includeEnd: boolean`
   *   Option to specify whether to include the end or not. False by default.
   *
   * Examples:
   *
   *     math.range(2, 6)        // [2, 3, 4, 5]
   *     math.range(2, -3, -1)   // [2, 1, 0, -1, -2]
   *     math.range('2:1:6')     // [2, 3, 4, 5]
   *     math.range(2, 6, true)  // [2, 3, 4, 5, 6]
   *
   * See also:
   *
   *     ones, zeros, size, subset
   *
   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
   * @return {Array | Matrix} range
   */
  return typed(name, {
    // TODO: simplify signatures when typed-function supports default values and optional arguments
    // TODO: a number or boolean should not be converted to string here
    string: _strRange,
    'string, boolean': _strRange,
    'number, number': function numberNumber(start, end) {
      return _out(_rangeEx(start, end, 1));
    },
    'number, number, number': function numberNumberNumber(start, end, step) {
      return _out(_rangeEx(start, end, step));
    },
    'number, number, boolean': function numberNumberBoolean(start, end, includeEnd) {
      return includeEnd ? _out(_rangeInc(start, end, 1)) : _out(_rangeEx(start, end, 1));
    },
    'number, number, number, boolean': function numberNumberNumberBoolean(start, end, step, includeEnd) {
      return includeEnd ? _out(_rangeInc(start, end, step)) : _out(_rangeEx(start, end, step));
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(start, end) {
      var BigNumber = start.constructor;
      return _out(_bigRangeEx(start, end, new BigNumber(1)));
    },
    'BigNumber, BigNumber, BigNumber': function BigNumberBigNumberBigNumber(start, end, step) {
      return _out(_bigRangeEx(start, end, step));
    },
    'BigNumber, BigNumber, boolean': function BigNumberBigNumberBoolean(start, end, includeEnd) {
      var BigNumber = start.constructor;
      return includeEnd ? _out(_bigRangeInc(start, end, new BigNumber(1))) : _out(_bigRangeEx(start, end, new BigNumber(1)));
    },
    'BigNumber, BigNumber, BigNumber, boolean': function BigNumberBigNumberBigNumberBoolean(start, end, step, includeEnd) {
      return includeEnd ? _out(_bigRangeInc(start, end, step)) : _out(_bigRangeEx(start, end, step));
    }
  });

  function _out(arr) {
    if (config.matrix === 'Matrix') {
      return matrix ? matrix(arr) : (0, _noop.noMatrix)();
    }

    return arr;
  }

  function _strRange(str, includeEnd) {
    var r = _parse(str);

    if (!r) {
      throw new SyntaxError('String "' + str + '" is no valid range');
    }

    var fn;

    if (config.number === 'BigNumber') {
      if (bignumber === undefined) {
        (0, _noop.noBignumber)();
      }

      fn = includeEnd ? _bigRangeInc : _bigRangeEx;
      return _out(fn(bignumber(r.start), bignumber(r.end), bignumber(r.step)));
    } else {
      fn = includeEnd ? _rangeInc : _rangeEx;
      return _out(fn(r.start, r.end, r.step));
    }
  }
  /**
   * Create a range with numbers. End is excluded
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */


  function _rangeEx(start, end, step) {
    var array = [];
    var x = start;

    if (step > 0) {
      while (smaller(x, end)) {
        array.push(x);
        x += step;
      }
    } else if (step < 0) {
      while (larger(x, end)) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }
  /**
   * Create a range with numbers. End is included
   * @param {number} start
   * @param {number} end
   * @param {number} step
   * @returns {Array} range
   * @private
   */


  function _rangeInc(start, end, step) {
    var array = [];
    var x = start;

    if (step > 0) {
      while (smallerEq(x, end)) {
        array.push(x);
        x += step;
      }
    } else if (step < 0) {
      while (largerEq(x, end)) {
        array.push(x);
        x += step;
      }
    }

    return array;
  }
  /**
   * Create a range with big numbers. End is excluded
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */


  function _bigRangeEx(start, end, step) {
    var zero = bignumber(0);
    var array = [];
    var x = start;

    if (step.gt(zero)) {
      while (smaller(x, end)) {
        array.push(x);
        x = x.plus(step);
      }
    } else if (step.lt(zero)) {
      while (larger(x, end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }
  /**
   * Create a range with big numbers. End is included
   * @param {BigNumber} start
   * @param {BigNumber} end
   * @param {BigNumber} step
   * @returns {Array} range
   * @private
   */


  function _bigRangeInc(start, end, step) {
    var zero = bignumber(0);
    var array = [];
    var x = start;

    if (step.gt(zero)) {
      while (smallerEq(x, end)) {
        array.push(x);
        x = x.plus(step);
      }
    } else if (step.lt(zero)) {
      while (largerEq(x, end)) {
        array.push(x);
        x = x.plus(step);
      }
    }

    return array;
  }
  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {string} str
   * @return {{start: number, end: number, step: number} | null} range Object containing properties start, end, step
   * @private
   */


  function _parse(str) {
    var args = str.split(':'); // number

    var nums = args.map(function (arg) {
      // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
      return Number(arg);
    });
    var invalid = nums.some(function (num) {
      return isNaN(num);
    });

    if (invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };

      default:
        return null;
    }
  }
});
exports.createRange = createRange;