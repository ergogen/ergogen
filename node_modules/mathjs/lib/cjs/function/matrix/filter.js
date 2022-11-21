"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilter = void 0;

var _array = require("../../utils/array.js");

var _function = require("../../utils/function.js");

var _factory = require("../../utils/factory.js");

var name = 'filter';
var dependencies = ['typed'];
var createFilter = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Filter the items in an array or one dimensional matrix.
   *
   * Syntax:
   *
   *    math.filter(x, test)
   *
   * Examples:
   *
   *    function isPositive (x) {
   *      return x > 0
   *    }
   *    math.filter([6, -2, -1, 4, 3], isPositive) // returns [6, 4, 3]
   *
   *    math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/) // returns ["23", "100", "55"]
   *
   * See also:
   *
   *    forEach, map, sort
   *
   * @param {Matrix | Array} x    A one dimensional matrix or array to filter
   * @param {Function | RegExp} test
   *        A function or regular expression to test items.
   *        All entries for which `test` returns true are returned.
   *        When `test` is a function, it is invoked with three parameters:
   *        the value of the element, the index of the element, and the
   *        matrix/array being traversed. The function must return a boolean.
   * @return {Matrix | Array} Returns the filtered matrix.
   */
  return typed('filter', {
    'Array, function': _filterCallback,
    'Matrix, function': function MatrixFunction(x, test) {
      return x.create(_filterCallback(x.toArray(), test));
    },
    'Array, RegExp': _array.filterRegExp,
    'Matrix, RegExp': function MatrixRegExp(x, test) {
      return x.create((0, _array.filterRegExp)(x.toArray(), test));
    }
  });
});
/**
 * Filter values in a callback given a callback function
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */

exports.createFilter = createFilter;

function _filterCallback(x, callback) {
  // figure out what number of arguments the callback function expects
  var args = (0, _function.maxArgumentCount)(callback);
  return (0, _array.filter)(x, function (value, index, array) {
    // invoke the callback function with the right number of arguments
    if (args === 1) {
      return callback(value);
    } else if (args === 2) {
      return callback(value, [index]);
    } else {
      // 3 or -1
      return callback(value, [index], array);
    }
  });
}