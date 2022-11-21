"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFunctionAssignmentNode = void 0;

var _is = require("../../utils/is.js");

var _keywords = require("../keywords.js");

var _string = require("../../utils/string.js");

var _array = require("../../utils/array.js");

var _latex = require("../../utils/latex.js");

var _operators = require("../operators.js");

var _factory = require("../../utils/factory.js");

var name = 'FunctionAssignmentNode';
var dependencies = ['typed', 'Node'];
var createFunctionAssignmentNode = /* #__PURE__ */(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      Node = _ref.Node;

  /**
   * @constructor FunctionAssignmentNode
   * @extends {Node}
   * Function assignment
   *
   * @param {string} name           Function name
   * @param {string[] | Array.<{name: string, type: string}>} params
   *                                Array with function parameter names, or an
   *                                array with objects containing the name
   *                                and type of the parameter
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode(name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    } // validate input


    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!Array.isArray(params)) throw new TypeError('Array containing strings or objects expected for parameter "params"');
    if (!(0, _is.isNode)(expr)) throw new TypeError('Node expected for parameter "expr"');
    if (_keywords.keywords.has(name)) throw new Error('Illegal function name, "' + name + '" is a reserved keyword');
    this.name = name;
    this.params = params.map(function (param) {
      return param && param.name || param;
    });
    this.types = params.map(function (param) {
      return param && param.type || 'any';
    });
    this.expr = expr;
  }

  FunctionAssignmentNode.prototype = new Node();
  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';
  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true;
  /**
   * Compile a node into a JavaScript function.
   * This basically pre-calculates as much as possible and only leaves open
   * calculations which depend on a dynamic scope with variables.
   * @param {Object} math     Math.js namespace with functions and constants.
   * @param {Object} argNames An object with argument names as key and `true`
   *                          as value. Used in the SymbolNode to optimize
   *                          for arguments from user assigned functions
   *                          (see FunctionAssignmentNode) or special symbols
   *                          like `end` (see IndexNode).
   * @return {function} Returns a function which can be called like:
   *                        evalNode(scope: Object, args: Object, context: *)
   */

  FunctionAssignmentNode.prototype._compile = function (math, argNames) {
    var childArgNames = Object.create(argNames);
    (0, _array.forEach)(this.params, function (param) {
      childArgNames[param] = true;
    }); // compile the function expression with the child args

    var evalExpr = this.expr._compile(math, childArgNames);

    var name = this.name;
    var params = this.params;
    var signature = (0, _array.join)(this.types, ',');
    var syntax = name + '(' + (0, _array.join)(this.params, ', ') + ')';
    return function evalFunctionAssignmentNode(scope, args, context) {
      var signatures = {};

      signatures[signature] = function () {
        var childArgs = Object.create(args);

        for (var i = 0; i < params.length; i++) {
          childArgs[params[i]] = arguments[i];
        }

        return evalExpr(scope, childArgs, context);
      };

      var fn = typed(name, signatures);
      fn.syntax = syntax;
      scope.set(name, fn);
      return fn;
    };
  };
  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */


  FunctionAssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this);
  };
  /**
   * Create a new FunctionAssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
   */


  FunctionAssignmentNode.prototype.map = function (callback) {
    var expr = this._ifNode(callback(this.expr, 'expr', this));

    return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
  };
  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionAssignmentNode}
   */


  FunctionAssignmentNode.prototype.clone = function () {
    return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
  };
  /**
   * Is parenthesis needed?
   * @param {Node} node
   * @param {Object} parenthesis
   * @private
   */


  function needParenthesis(node, parenthesis) {
    var precedence = (0, _operators.getPrecedence)(node, parenthesis);
    var exprPrecedence = (0, _operators.getPrecedence)(node.expr, parenthesis);
    return parenthesis === 'all' || exprPrecedence !== null && exprPrecedence <= precedence;
  }
  /**
   * get string representation
   * @param {Object} options
   * @return {string} str
   */


  FunctionAssignmentNode.prototype._toString = function (options) {
    var parenthesis = options && options.parenthesis ? options.parenthesis : 'keep';
    var expr = this.expr.toString(options);

    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')';
    }

    return this.name + '(' + this.params.join(', ') + ') = ' + expr;
  };
  /**
   * Get a JSON representation of the node
   * @returns {Object}
   */


  FunctionAssignmentNode.prototype.toJSON = function () {
    var types = this.types;
    return {
      mathjs: 'FunctionAssignmentNode',
      name: this.name,
      params: this.params.map(function (param, index) {
        return {
          name: param,
          type: types[index]
        };
      }),
      expr: this.expr
    };
  };
  /**
   * Instantiate an FunctionAssignmentNode from its JSON representation
   * @param {Object} json  An object structured like
   *                       `{"mathjs": "FunctionAssignmentNode", name: ..., params: ..., expr: ...}`,
   *                       where mathjs is optional
   * @returns {FunctionAssignmentNode}
   */


  FunctionAssignmentNode.fromJSON = function (json) {
    return new FunctionAssignmentNode(json.name, json.params, json.expr);
  };
  /**
   * get HTML representation
   * @param {Object} options
   * @return {string} str
   */


  FunctionAssignmentNode.prototype.toHTML = function (options) {
    var parenthesis = options && options.parenthesis ? options.parenthesis : 'keep';
    var params = [];

    for (var i = 0; i < this.params.length; i++) {
      params.push('<span class="math-symbol math-parameter">' + (0, _string.escape)(this.params[i]) + '</span>');
    }

    var expr = this.expr.toHTML(options);

    if (needParenthesis(this, parenthesis)) {
      expr = '<span class="math-parenthesis math-round-parenthesis">(</span>' + expr + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }

    return '<span class="math-function">' + (0, _string.escape)(this.name) + '</span>' + '<span class="math-parenthesis math-round-parenthesis">(</span>' + params.join('<span class="math-separator">,</span>') + '<span class="math-parenthesis math-round-parenthesis">)</span><span class="math-operator math-assignment-operator math-variable-assignment-operator math-binary-operator">=</span>' + expr;
  };
  /**
   * get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */


  FunctionAssignmentNode.prototype._toTex = function (options) {
    var parenthesis = options && options.parenthesis ? options.parenthesis : 'keep';
    var expr = this.expr.toTex(options);

    if (needParenthesis(this, parenthesis)) {
      expr = "\\left(".concat(expr, "\\right)");
    }

    return '\\mathrm{' + this.name + '}\\left(' + this.params.map(_latex.toSymbol).join(',') + '\\right):=' + expr;
  };

  return FunctionAssignmentNode;
}, {
  isClass: true,
  isNode: true
});
exports.createFunctionAssignmentNode = createFunctionAssignmentNode;