import { createMap, isMap } from '../../../utils/map.js';
import { isFunctionNode, isNode, isOperatorNode, isParenthesisNode, isSymbolNode } from '../../../utils/is.js';
import { factory } from '../../../utils/factory.js';
var name = 'resolve';
var dependencies = ['parse', 'FunctionNode', 'OperatorNode', 'ParenthesisNode'];
export var createResolve = /* #__PURE__ */factory(name, dependencies, _ref => {
  var {
    parse,
    FunctionNode,
    OperatorNode,
    ParenthesisNode
  } = _ref;

  /**
   * resolve(expr, scope) replaces variable nodes with their scoped values
   *
   * Syntax:
   *
   *     simplify.resolve(expr, scope)
   *
   * Examples:
   *
   *     math.simplify.resolve('x + y', {x:1, y:2})           // Node {1 + 2}
   *     math.simplify.resolve(math.parse('x+y'), {x:1, y:2}) // Node {1 + 2}
   *     math.simplify('x+y', {x:2, y:'x+x'}).toString()      // "6"
   *
   * @param {Node} node
   *     The expression tree to be simplified
   * @param {Object} scope with variables to be resolved
   */
  function resolve(node, scope) {
    if (!scope) {
      return node;
    }

    if (!isMap(scope)) {
      scope = createMap(scope);
    }

    if (isSymbolNode(node)) {
      var value = scope.get(node.name);

      if (isNode(value)) {
        return resolve(value, scope);
      } else if (typeof value === 'number') {
        return parse(String(value));
      }
    } else if (isOperatorNode(node)) {
      var args = node.args.map(function (arg) {
        return resolve(arg, scope);
      });
      return new OperatorNode(node.op, node.fn, args, node.implicit);
    } else if (isParenthesisNode(node)) {
      return new ParenthesisNode(resolve(node.content, scope));
    } else if (isFunctionNode(node)) {
      var _args = node.args.map(function (arg) {
        return resolve(arg, scope);
      });

      return new FunctionNode(node.name, _args);
    }

    return node;
  }

  return resolve;
});