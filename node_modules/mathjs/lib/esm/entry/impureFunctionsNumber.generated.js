import _extends from "@babel/runtime/helpers/extends";

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import { config } from './configReadonly.js';
import { createChainClass, createReviver, createChain, createNode, createObjectNode, createRangeNode, createRelationalNode, createSymbolNode, createAccessorNode, createAssignmentNode, createConditionalNode, createFunctionNode, createIndexNode, createOperatorNode, createConstantNode, createFunctionAssignmentNode, createParenthesisNode, createBlockNode, createArrayNode, createParse, createSimplify, createCompile, createEvaluate, createHelpClass, createParserClass, createDerivative, createRationalize, createHelp, createParser, createApplyTransform, createFilterTransform, createForEachTransform, createMapTransform, createMeanTransform, createSubsetTransform, createStdTransform, createSumTransform, createMaxTransform, createMinTransform, createRangeTransform, createVarianceTransform } from '../factoriesNumber.js';
import { e, _false, index, _Infinity, LN10, LOG10E, matrix, _NaN, _null, phi, Range, replacer, SQRT1_2, // eslint-disable-line camelcase
subset, tau, typed, unaryPlus, version, xor, abs, acos, acot, acsc, add, and, asec, asin, atan, atanh, bitAnd, bitOr, boolean, cbrt, combinations, compare, compareText, cos, cot, csc, cube, divide, equalScalar, erf, exp, filter, fix, forEach, format, gamma, isInteger, isNegative, isPositive, isZero, LOG2E, largerEq, leftShift, log10, log2, map, mean, mod, multiply, not, number, or, pi, pow, random, rightArithShift, round, sec, sign, sin, size, smallerEq, square, string, subtract, tanh, typeOf, unequal, xgcd, acoth, addScalar, asech, bitNot, ceil, combinationsWithRep, cosh, csch, divideScalar, equalText, expm1, isNumeric, LN2, lcm, log1p, multiplyScalar, nthRoot, pickRandom, randomInt, ResultSet, SQRT2, sinh, sqrt, tan, unaryMinus, acosh, apply, asinh, bitXor, catalan, compareNatural, equal, factorial, hasNumericValue, isNaN, larger, mode, norm, partitionSelect, print, quantileSeq, rightLogShift, smaller, stirlingS2, _true, variance, acsch, atan2, composition, deepEqual, floor, hypot, log, median, multinomial, permutations, range, sech, std, clone, coth, gcd, isPrime, numeric, prod, bellNumbers, mad, sum, max, min } from './pureFunctionsNumber.generated.js';
var math = {}; // NOT pure!

var mathWithTransform = {}; // NOT pure!

var classes = {}; // NOT pure!

export var Chain = createChainClass({
  math
});
export var reviver = createReviver({
  classes
});
export var chain = createChain({
  Chain,
  typed
});
export var Node = createNode({
  mathWithTransform
});
export var ObjectNode = createObjectNode({
  Node
});
export var RangeNode = createRangeNode({
  Node
});
export var RelationalNode = createRelationalNode({
  Node
});
export var SymbolNode = createSymbolNode({
  Node,
  math
});
export var AccessorNode = createAccessorNode({
  Node,
  subset
});
export var AssignmentNode = createAssignmentNode({
  matrix,
  Node,
  subset
});
export var ConditionalNode = createConditionalNode({
  Node
});
export var FunctionNode = createFunctionNode({
  Node,
  SymbolNode,
  math
});
export var IndexNode = createIndexNode({
  Node,
  Range,
  size
});
export var OperatorNode = createOperatorNode({
  Node
});
export var ConstantNode = createConstantNode({
  Node
});
export var FunctionAssignmentNode = createFunctionAssignmentNode({
  Node,
  typed
});
export var ParenthesisNode = createParenthesisNode({
  Node
});
export var BlockNode = createBlockNode({
  Node,
  ResultSet
});
export var ArrayNode = createArrayNode({
  Node
});
export var parse = createParse({
  AccessorNode,
  ArrayNode,
  AssignmentNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  FunctionAssignmentNode,
  FunctionNode,
  IndexNode,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  RangeNode,
  RelationalNode,
  SymbolNode,
  config,
  numeric,
  typed
});
export var simplify = createSimplify({
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode,
  add,
  config,
  divide,
  equal,
  isZero,
  mathWithTransform,
  multiply,
  parse,
  pow,
  subtract,
  typed
});
export var compile = createCompile({
  parse,
  typed
});
export var evaluate = createEvaluate({
  parse,
  typed
});
export var Help = createHelpClass({
  parse
});
export var Parser = createParserClass({
  evaluate
});
export var derivative = createDerivative({
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode,
  config,
  equal,
  isZero,
  numeric,
  parse,
  simplify,
  typed
});
export var rationalize = createRationalize({
  ConstantNode,
  FunctionNode,
  OperatorNode,
  ParenthesisNode,
  SymbolNode,
  add,
  config,
  divide,
  equal,
  isZero,
  mathWithTransform,
  multiply,
  parse,
  pow,
  simplify,
  subtract,
  typed
});
export var help = createHelp({
  Help,
  mathWithTransform,
  typed
});
export var parser = createParser({
  Parser,
  typed
});

_extends(math, {
  e,
  false: _false,
  index,
  Infinity: _Infinity,
  LN10,
  LOG10E,
  matrix,
  NaN: _NaN,
  null: _null,
  phi,
  replacer,
  reviver,
  SQRT1_2,
  subset,
  tau,
  typed,
  unaryPlus,
  'E': e,
  version,
  xor,
  abs,
  acos,
  acot,
  acsc,
  add,
  and,
  asec,
  asin,
  atan,
  atanh,
  bitAnd,
  bitOr,
  boolean,
  cbrt,
  chain,
  combinations,
  compare,
  compareText,
  cos,
  cot,
  csc,
  cube,
  divide,
  equalScalar,
  erf,
  exp,
  filter,
  fix,
  forEach,
  format,
  gamma,
  isInteger,
  isNegative,
  isPositive,
  isZero,
  LOG2E,
  largerEq,
  leftShift,
  log10,
  log2,
  map,
  mean,
  mod,
  multiply,
  not,
  number,
  or,
  pi,
  pow,
  random,
  rightArithShift,
  round,
  sec,
  sign,
  sin,
  size,
  smallerEq,
  square,
  string,
  subtract,
  tanh,
  typeOf,
  unequal,
  xgcd,
  acoth,
  addScalar,
  asech,
  bitNot,
  ceil,
  combinationsWithRep,
  cosh,
  csch,
  divideScalar,
  equalText,
  expm1,
  isNumeric,
  LN2,
  lcm,
  log1p,
  multiplyScalar,
  nthRoot,
  pickRandom,
  randomInt,
  SQRT2,
  sinh,
  sqrt,
  tan,
  unaryMinus,
  acosh,
  apply,
  asinh,
  bitXor,
  catalan,
  compareNatural,
  equal,
  factorial,
  hasNumericValue,
  isNaN,
  larger,
  mode,
  norm,
  partitionSelect,
  print,
  quantileSeq,
  rightLogShift,
  smaller,
  stirlingS2,
  true: _true,
  variance,
  acsch,
  atan2,
  composition,
  deepEqual,
  floor,
  hypot,
  log,
  median,
  multinomial,
  permutations,
  range,
  sech,
  std,
  'PI': pi,
  clone,
  coth,
  gcd,
  isPrime,
  numeric,
  prod,
  bellNumbers,
  mad,
  sum,
  max,
  parse,
  simplify,
  compile,
  evaluate,
  derivative,
  min,
  rationalize,
  help,
  parser,
  config
});

_extends(mathWithTransform, math, {
  apply: createApplyTransform({
    isInteger,
    typed
  }),
  filter: createFilterTransform({
    typed
  }),
  forEach: createForEachTransform({
    typed
  }),
  map: createMapTransform({
    typed
  }),
  mean: createMeanTransform({
    add,
    divide,
    typed
  }),
  subset: createSubsetTransform({}),
  std: createStdTransform({
    sqrt,
    typed,
    variance
  }),
  sum: createSumTransform({
    add,
    config,
    numeric,
    typed
  }),
  max: createMaxTransform({
    config,
    larger,
    numeric,
    typed
  }),
  min: createMinTransform({
    config,
    numeric,
    smaller,
    typed
  }),
  range: createRangeTransform({
    matrix,
    config,
    larger,
    largerEq,
    smaller,
    smallerEq,
    typed
  }),
  variance: createVarianceTransform({
    add,
    apply,
    divide,
    isNaN,
    multiply,
    subtract,
    typed
  })
});

_extends(classes, {
  Chain,
  Range,
  Node,
  ObjectNode,
  RangeNode,
  RelationalNode,
  SymbolNode,
  AccessorNode,
  AssignmentNode,
  ConditionalNode,
  FunctionNode,
  IndexNode,
  OperatorNode,
  ResultSet,
  ConstantNode,
  FunctionAssignmentNode,
  ParenthesisNode,
  BlockNode,
  ArrayNode,
  Help,
  Parser
});

Chain.createProxy(math);
export { embeddedDocs as docs } from '../expression/embeddedDocs/embeddedDocs.js';