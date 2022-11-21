"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterTransform = void 0;

var _is = require("../../utils/is.js");

var _array = require("../../utils/array.js");

var _function = require("../../utils/function.js");

var _compileInlineExpression = require("./utils/compileInlineExpression.js");

var _factory = require("../../utils/factory.js");

var name = 'filter';
var dependencies = ['typed'];
var createFilterTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Attach a transform function to math.filter
   * Adds a property transform containing the transform function.
   *
   * This transform adds support for equations as test function for math.filter,
   * so you can do something like 'filter([3, -2, 5], x > 0)'.
   */
  function filterTransform(args, math, scope) {
    var x, callback;

    if (args[0]) {
      x = args[0].compile().evaluate(scope);
    }

    if (args[1]) {
      if ((0, _is.isSymbolNode)(args[1]) || (0, _is.isFunctionAssignmentNode)(args[1])) {
        // a function pointer, like filter([3, -2, 5], myTestFunction)
        callback = args[1].compile().evaluate(scope);
      } else {
        // an expression like filter([3, -2, 5], x > 0)
        callback = (0, _compileInlineExpression.compileInlineExpression)(args[1], math, scope);
      }
    }

    return filter(x, callback);
  }

  filterTransform.rawArgs = true; // one based version of function filter

  var filter = typed('filter', {
    'Array, function': _filter,
    'Matrix, function': function MatrixFunction(x, test) {
      return x.create(_filter(x.toArray(), test));
    },
    'Array, RegExp': _array.filterRegExp,
    'Matrix, RegExp': function MatrixRegExp(x, test) {
      return x.create((0, _array.filterRegExp)(x.toArray(), test));
    }
  });
  return filterTransform;
}, {
  isTransformFunction: true
});
/**
 * Filter values in a callback given a callback function
 *
 * !!! Passes a one-based index !!!
 *
 * @param {Array} x
 * @param {Function} callback
 * @return {Array} Returns the filtered array
 * @private
 */

exports.createFilterTransform = createFilterTransform;

function _filter(x, callback) {
  // figure out what number of arguments the callback function expects
  var args = (0, _function.maxArgumentCount)(callback);
  return (0, _array.filter)(x, function (value, index, array) {
    // invoke the callback function with the right number of arguments
    if (args === 1) {
      return callback(value);
    } else if (args === 2) {
      return callback(value, [index + 1]);
    } else {
      // 3 or -1
      return callback(value, [index + 1], array);
    }
  });
}