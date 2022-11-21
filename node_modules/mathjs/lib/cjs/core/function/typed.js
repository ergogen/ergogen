"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTyped = void 0;

var _is = require("../../utils/is.js");

var _typedFunction = _interopRequireDefault(require("typed-function"));

var _number = require("../../utils/number.js");

var _factory = require("../../utils/factory.js");

var _map = require("../../utils/map.js");

/**
 * Create a typed-function which checks the types of the arguments and
 * can match them against multiple provided signatures. The typed-function
 * automatically converts inputs in order to find a matching signature.
 * Typed functions throw informative errors in case of wrong input arguments.
 *
 * See the library [typed-function](https://github.com/josdejong/typed-function)
 * for detailed documentation.
 *
 * Syntax:
 *
 *     math.typed(name, signatures) : function
 *     math.typed(signatures) : function
 *
 * Examples:
 *
 *     // create a typed function with multiple types per argument (type union)
 *     const fn2 = typed({
 *       'number | boolean': function (b) {
 *         return 'b is a number or boolean'
 *       },
 *       'string, number | boolean': function (a, b) {
 *         return 'a is a string, b is a number or boolean'
 *       }
 *     })
 *
 *     // create a typed function with an any type argument
 *     const log = typed({
 *       'string, any': function (event, data) {
 *         console.log('event: ' + event + ', data: ' + JSON.stringify(data))
 *       }
 *     })
 *
 * @param {string} [name]                          Optional name for the typed-function
 * @param {Object<string, function>} signatures   Object with one or multiple function signatures
 * @returns {function} The created typed-function.
 */
// returns a new instance of typed-function
var _createTyped2 = function _createTyped() {
  // initially, return the original instance of typed-function
  // consecutively, return a new instance from typed.create.
  _createTyped2 = _typedFunction["default"].create;
  return _typedFunction["default"];
};

var dependencies = ['?BigNumber', '?Complex', '?DenseMatrix', '?Fraction'];
/**
 * Factory function for creating a new typed instance
 * @param {Object} dependencies   Object with data types like Complex and BigNumber
 * @returns {Function}
 */

var createTyped = /* #__PURE__ */(0, _factory.factory)('typed', dependencies, function createTyped(_ref) {
  var BigNumber = _ref.BigNumber,
      Complex = _ref.Complex,
      DenseMatrix = _ref.DenseMatrix,
      Fraction = _ref.Fraction;

  // TODO: typed-function must be able to silently ignore signatures with unknown data types
  // get a new instance of typed-function
  var typed = _createTyped2(); // define all types. The order of the types determines in which order function
  // arguments are type-checked (so for performance it's important to put the
  // most used types first).


  typed.types = [{
    name: 'number',
    test: _is.isNumber
  }, {
    name: 'Complex',
    test: _is.isComplex
  }, {
    name: 'BigNumber',
    test: _is.isBigNumber
  }, {
    name: 'Fraction',
    test: _is.isFraction
  }, {
    name: 'Unit',
    test: _is.isUnit
  }, {
    name: 'string',
    test: _is.isString
  }, {
    name: 'Chain',
    test: _is.isChain
  }, {
    name: 'Array',
    test: _is.isArray
  }, {
    name: 'Matrix',
    test: _is.isMatrix
  }, {
    name: 'DenseMatrix',
    test: _is.isDenseMatrix
  }, {
    name: 'SparseMatrix',
    test: _is.isSparseMatrix
  }, {
    name: 'Range',
    test: _is.isRange
  }, {
    name: 'Index',
    test: _is.isIndex
  }, {
    name: 'boolean',
    test: _is.isBoolean
  }, {
    name: 'ResultSet',
    test: _is.isResultSet
  }, {
    name: 'Help',
    test: _is.isHelp
  }, {
    name: 'function',
    test: _is.isFunction
  }, {
    name: 'Date',
    test: _is.isDate
  }, {
    name: 'RegExp',
    test: _is.isRegExp
  }, {
    name: 'null',
    test: _is.isNull
  }, {
    name: 'undefined',
    test: _is.isUndefined
  }, {
    name: 'AccessorNode',
    test: _is.isAccessorNode
  }, {
    name: 'ArrayNode',
    test: _is.isArrayNode
  }, {
    name: 'AssignmentNode',
    test: _is.isAssignmentNode
  }, {
    name: 'BlockNode',
    test: _is.isBlockNode
  }, {
    name: 'ConditionalNode',
    test: _is.isConditionalNode
  }, {
    name: 'ConstantNode',
    test: _is.isConstantNode
  }, {
    name: 'FunctionNode',
    test: _is.isFunctionNode
  }, {
    name: 'FunctionAssignmentNode',
    test: _is.isFunctionAssignmentNode
  }, {
    name: 'IndexNode',
    test: _is.isIndexNode
  }, {
    name: 'Node',
    test: _is.isNode
  }, {
    name: 'ObjectNode',
    test: _is.isObjectNode
  }, {
    name: 'OperatorNode',
    test: _is.isOperatorNode
  }, {
    name: 'ParenthesisNode',
    test: _is.isParenthesisNode
  }, {
    name: 'RangeNode',
    test: _is.isRangeNode
  }, {
    name: 'SymbolNode',
    test: _is.isSymbolNode
  }, {
    name: 'Map',
    test: _map.isMap
  }, {
    name: 'Object',
    test: _is.isObject
  } // order 'Object' last, it matches on other classes too
  ];
  typed.conversions = [{
    from: 'number',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      } // note: conversion from number to BigNumber can fail if x has >15 digits


      if ((0, _number.digits)(x) > 15) {
        throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
      }

      return new BigNumber(x);
    }
  }, {
    from: 'number',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x, 0);
    }
  }, {
    from: 'number',
    to: 'string',
    convert: function convert(x) {
      return x + '';
    }
  }, {
    from: 'BigNumber',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x.toNumber(), 0);
    }
  }, {
    from: 'Fraction',
    to: 'BigNumber',
    convert: function convert(x) {
      throw new TypeError('Cannot implicitly convert a Fraction to BigNumber or vice versa. ' + 'Use function bignumber(x) to convert to BigNumber or fraction(x) to convert to Fraction.');
    }
  }, {
    from: 'Fraction',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      return new Complex(x.valueOf(), 0);
    }
  }, {
    from: 'number',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      var f = new Fraction(x);

      if (f.valueOf() !== x) {
        throw new TypeError('Cannot implicitly convert a number to a Fraction when there will be a loss of precision ' + '(value: ' + x + '). ' + 'Use function fraction(x) to convert to Fraction.');
      }

      return f;
    }
  }, {
    // FIXME: add conversion from Fraction to number, for example for `sqrt(fraction(1,3))`
    //  from: 'Fraction',
    //  to: 'number',
    //  convert: function (x) {
    //    return x.valueOf()
    //  }
    // }, {
    from: 'string',
    to: 'number',
    convert: function convert(x) {
      var n = Number(x);

      if (isNaN(n)) {
        throw new Error('Cannot convert "' + x + '" to a number');
      }

      return n;
    }
  }, {
    from: 'string',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      }

      try {
        return new BigNumber(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to BigNumber');
      }
    }
  }, {
    from: 'string',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      try {
        return new Fraction(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Fraction');
      }
    }
  }, {
    from: 'string',
    to: 'Complex',
    convert: function convert(x) {
      if (!Complex) {
        throwNoComplex(x);
      }

      try {
        return new Complex(x);
      } catch (err) {
        throw new Error('Cannot convert "' + x + '" to Complex');
      }
    }
  }, {
    from: 'boolean',
    to: 'number',
    convert: function convert(x) {
      return +x;
    }
  }, {
    from: 'boolean',
    to: 'BigNumber',
    convert: function convert(x) {
      if (!BigNumber) {
        throwNoBignumber(x);
      }

      return new BigNumber(+x);
    }
  }, {
    from: 'boolean',
    to: 'Fraction',
    convert: function convert(x) {
      if (!Fraction) {
        throwNoFraction(x);
      }

      return new Fraction(+x);
    }
  }, {
    from: 'boolean',
    to: 'string',
    convert: function convert(x) {
      return String(x);
    }
  }, {
    from: 'Array',
    to: 'Matrix',
    convert: function convert(array) {
      if (!DenseMatrix) {
        throwNoMatrix();
      }

      return new DenseMatrix(array);
    }
  }, {
    from: 'Matrix',
    to: 'Array',
    convert: function convert(matrix) {
      return matrix.valueOf();
    }
  }];
  return typed;
});
exports.createTyped = createTyped;

function throwNoBignumber(x) {
  throw new Error("Cannot convert value ".concat(x, " into a BigNumber: no class 'BigNumber' provided"));
}

function throwNoComplex(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Complex number: no class 'Complex' provided"));
}

function throwNoMatrix() {
  throw new Error('Cannot convert array into a Matrix: no class \'DenseMatrix\' provided');
}

function throwNoFraction(x) {
  throw new Error("Cannot convert value ".concat(x, " into a Fraction, no class 'Fraction' provided."));
}