"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Default Sylvester configurations.
 * @type {Object}
 */
var Sylvester = exports.Sylvester = {
  precision: 1e-6,
  approxPrecision: 1e-5
};

/**
 * A DimensionalityMismatchError is thrown when an operation is run on two
 * units which should share a certain dimensional relationship, but fail it.
 */

var DimensionalityMismatchError = exports.DimensionalityMismatchError = function (_Error) {
  _inherits(DimensionalityMismatchError, _Error);

  function DimensionalityMismatchError() {
    _classCallCheck(this, DimensionalityMismatchError);

    return _possibleConstructorReturn(this, (DimensionalityMismatchError.__proto__ || Object.getPrototypeOf(DimensionalityMismatchError)).apply(this, arguments));
  }

  return DimensionalityMismatchError;
}(Error);