"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMapTransform = void 0;

var _is = require("../../utils/is.js");

var _function = require("../../utils/function.js");

var _array = require("../../utils/array.js");

var _factory = require("../../utils/factory.js");

var _compileInlineExpression = require("./utils/compileInlineExpression.js");

var name = 'map';
var dependencies = ['typed'];
var createMapTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Attach a transform function to math.map
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  function mapTransform(args, math, scope) {
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

    return map(x, callback);
  }

  mapTransform.rawArgs = true; // one-based version of map function

  var map = typed('map', {
    'Array, function': function ArrayFunction(x, callback) {
      return _map(x, callback, x);
    },
    'Matrix, function': function MatrixFunction(x, callback) {
      return x.create(_map(x.valueOf(), callback, x));
    }
  });
  return mapTransform;
}, {
  isTransformFunction: true
});
/**
 * Map for a multi dimensional array. One-based indexes
 * @param {Array} array
 * @param {function} callback
 * @param {Array} orig
 * @return {Array}
 * @private
 */

exports.createMapTransform = createMapTransform;

function _map(array, callback, orig) {
  // figure out what number of arguments the callback function expects
  var argsCount = (0, _function.maxArgumentCount)(callback);

  function recurse(value, index) {
    if (Array.isArray(value)) {
      return (0, _array.map)(value, function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
      });
    } else {
      // invoke the (typed) callback function with the right number of arguments
      if (argsCount === 1) {
        return callback(value);
      } else if (argsCount === 2) {
        return callback(value, index);
      } else {
        // 3 or -1
        return callback(value, index, orig);
      }
    }
  }

  return recurse(array, []);
}