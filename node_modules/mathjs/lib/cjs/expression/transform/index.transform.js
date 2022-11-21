"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexTransform = void 0;

var _is = require("../../utils/is.js");

var _factory = require("../../utils/factory.js");

var name = 'index';
var dependencies = ['Index'];
var createIndexTransform = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var Index = _ref.Index;

  /**
   * Attach a transform function to math.index
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  return function indexTransform() {
    var args = [];

    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var arg = arguments[i]; // change from one-based to zero based, and convert BigNumber to number

      if ((0, _is.isRange)(arg)) {
        arg.start--;
        arg.end -= arg.step > 0 ? 0 : 2;
      } else if (arg && arg.isSet === true) {
        arg = arg.map(function (v) {
          return v - 1;
        });
      } else if ((0, _is.isArray)(arg) || (0, _is.isMatrix)(arg)) {
        arg = arg.map(function (v) {
          return v - 1;
        });
      } else if ((0, _is.isNumber)(arg)) {
        arg--;
      } else if ((0, _is.isBigNumber)(arg)) {
        arg = arg.toNumber() - 1;
      } else if (typeof arg === 'string') {// leave as is
      } else {
        throw new TypeError('Dimension must be an Array, Matrix, number, string, or Range');
      }

      args[i] = arg;
    }

    var res = new Index();
    Index.apply(res, args);
    return res;
  };
}, {
  isTransformFunction: true
});
exports.createIndexTransform = createIndexTransform;