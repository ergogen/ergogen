"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.derivative = exports.compile = exports.chain = exports.SymbolNode = exports.RelationalNode = exports.RangeNode = exports.Parser = exports.ParenthesisNode = exports.OperatorNode = exports.ObjectNode = exports.Node = exports.IndexNode = exports.Help = exports.FunctionNode = exports.FunctionAssignmentNode = exports.ConstantNode = exports.ConditionalNode = exports.Chain = exports.BlockNode = exports.AssignmentNode = exports.ArrayNode = exports.AccessorNode = void 0;
Object.defineProperty(exports, "docs", {
  enumerable: true,
  get: function get() {
    return _embeddedDocs.embeddedDocs;
  }
});
exports.simplify = exports.reviver = exports.rationalize = exports.parser = exports.parse = exports.help = exports.evaluate = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _configReadonly = require("./configReadonly.js");

var _factoriesNumber = require("../factoriesNumber.js");

var _pureFunctionsNumberGenerated = require("./pureFunctionsNumber.generated.js");

var _embeddedDocs = require("../expression/embeddedDocs/embeddedDocs.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var math = {}; // NOT pure!

var mathWithTransform = {}; // NOT pure!

var classes = {}; // NOT pure!

var Chain = (0, _factoriesNumber.createChainClass)({
  math: math
});
exports.Chain = Chain;
var reviver = (0, _factoriesNumber.createReviver)({
  classes: classes
});
exports.reviver = reviver;
var chain = (0, _factoriesNumber.createChain)({
  Chain: Chain,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.chain = chain;
var Node = (0, _factoriesNumber.createNode)({
  mathWithTransform: mathWithTransform
});
exports.Node = Node;
var ObjectNode = (0, _factoriesNumber.createObjectNode)({
  Node: Node
});
exports.ObjectNode = ObjectNode;
var RangeNode = (0, _factoriesNumber.createRangeNode)({
  Node: Node
});
exports.RangeNode = RangeNode;
var RelationalNode = (0, _factoriesNumber.createRelationalNode)({
  Node: Node
});
exports.RelationalNode = RelationalNode;
var SymbolNode = (0, _factoriesNumber.createSymbolNode)({
  Node: Node,
  math: math
});
exports.SymbolNode = SymbolNode;
var AccessorNode = (0, _factoriesNumber.createAccessorNode)({
  Node: Node,
  subset: _pureFunctionsNumberGenerated.subset
});
exports.AccessorNode = AccessorNode;
var AssignmentNode = (0, _factoriesNumber.createAssignmentNode)({
  matrix: _pureFunctionsNumberGenerated.matrix,
  Node: Node,
  subset: _pureFunctionsNumberGenerated.subset
});
exports.AssignmentNode = AssignmentNode;
var ConditionalNode = (0, _factoriesNumber.createConditionalNode)({
  Node: Node
});
exports.ConditionalNode = ConditionalNode;
var FunctionNode = (0, _factoriesNumber.createFunctionNode)({
  Node: Node,
  SymbolNode: SymbolNode,
  math: math
});
exports.FunctionNode = FunctionNode;
var IndexNode = (0, _factoriesNumber.createIndexNode)({
  Node: Node,
  Range: _pureFunctionsNumberGenerated.Range,
  size: _pureFunctionsNumberGenerated.size
});
exports.IndexNode = IndexNode;
var OperatorNode = (0, _factoriesNumber.createOperatorNode)({
  Node: Node
});
exports.OperatorNode = OperatorNode;
var ConstantNode = (0, _factoriesNumber.createConstantNode)({
  Node: Node
});
exports.ConstantNode = ConstantNode;
var FunctionAssignmentNode = (0, _factoriesNumber.createFunctionAssignmentNode)({
  Node: Node,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.FunctionAssignmentNode = FunctionAssignmentNode;
var ParenthesisNode = (0, _factoriesNumber.createParenthesisNode)({
  Node: Node
});
exports.ParenthesisNode = ParenthesisNode;
var BlockNode = (0, _factoriesNumber.createBlockNode)({
  Node: Node,
  ResultSet: _pureFunctionsNumberGenerated.ResultSet
});
exports.BlockNode = BlockNode;
var ArrayNode = (0, _factoriesNumber.createArrayNode)({
  Node: Node
});
exports.ArrayNode = ArrayNode;
var parse = (0, _factoriesNumber.createParse)({
  AccessorNode: AccessorNode,
  ArrayNode: ArrayNode,
  AssignmentNode: AssignmentNode,
  BlockNode: BlockNode,
  ConditionalNode: ConditionalNode,
  ConstantNode: ConstantNode,
  FunctionAssignmentNode: FunctionAssignmentNode,
  FunctionNode: FunctionNode,
  IndexNode: IndexNode,
  ObjectNode: ObjectNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  RangeNode: RangeNode,
  RelationalNode: RelationalNode,
  SymbolNode: SymbolNode,
  config: _configReadonly.config,
  numeric: _pureFunctionsNumberGenerated.numeric,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.parse = parse;
var simplify = (0, _factoriesNumber.createSimplify)({
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: _pureFunctionsNumberGenerated.add,
  config: _configReadonly.config,
  divide: _pureFunctionsNumberGenerated.divide,
  equal: _pureFunctionsNumberGenerated.equal,
  isZero: _pureFunctionsNumberGenerated.isZero,
  mathWithTransform: mathWithTransform,
  multiply: _pureFunctionsNumberGenerated.multiply,
  parse: parse,
  pow: _pureFunctionsNumberGenerated.pow,
  subtract: _pureFunctionsNumberGenerated.subtract,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.simplify = simplify;
var compile = (0, _factoriesNumber.createCompile)({
  parse: parse,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.compile = compile;
var evaluate = (0, _factoriesNumber.createEvaluate)({
  parse: parse,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.evaluate = evaluate;
var Help = (0, _factoriesNumber.createHelpClass)({
  parse: parse
});
exports.Help = Help;
var Parser = (0, _factoriesNumber.createParserClass)({
  evaluate: evaluate
});
exports.Parser = Parser;
var derivative = (0, _factoriesNumber.createDerivative)({
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  config: _configReadonly.config,
  equal: _pureFunctionsNumberGenerated.equal,
  isZero: _pureFunctionsNumberGenerated.isZero,
  numeric: _pureFunctionsNumberGenerated.numeric,
  parse: parse,
  simplify: simplify,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.derivative = derivative;
var rationalize = (0, _factoriesNumber.createRationalize)({
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: _pureFunctionsNumberGenerated.add,
  config: _configReadonly.config,
  divide: _pureFunctionsNumberGenerated.divide,
  equal: _pureFunctionsNumberGenerated.equal,
  isZero: _pureFunctionsNumberGenerated.isZero,
  mathWithTransform: mathWithTransform,
  multiply: _pureFunctionsNumberGenerated.multiply,
  parse: parse,
  pow: _pureFunctionsNumberGenerated.pow,
  simplify: simplify,
  subtract: _pureFunctionsNumberGenerated.subtract,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.rationalize = rationalize;
var help = (0, _factoriesNumber.createHelp)({
  Help: Help,
  mathWithTransform: mathWithTransform,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.help = help;
var parser = (0, _factoriesNumber.createParser)({
  Parser: Parser,
  typed: _pureFunctionsNumberGenerated.typed
});
exports.parser = parser;
(0, _extends2["default"])(math, {
  e: _pureFunctionsNumberGenerated.e,
  "false": _pureFunctionsNumberGenerated._false,
  index: _pureFunctionsNumberGenerated.index,
  Infinity: _pureFunctionsNumberGenerated._Infinity,
  LN10: _pureFunctionsNumberGenerated.LN10,
  LOG10E: _pureFunctionsNumberGenerated.LOG10E,
  matrix: _pureFunctionsNumberGenerated.matrix,
  NaN: _pureFunctionsNumberGenerated._NaN,
  "null": _pureFunctionsNumberGenerated._null,
  phi: _pureFunctionsNumberGenerated.phi,
  replacer: _pureFunctionsNumberGenerated.replacer,
  reviver: reviver,
  SQRT1_2: _pureFunctionsNumberGenerated.SQRT1_2,
  subset: _pureFunctionsNumberGenerated.subset,
  tau: _pureFunctionsNumberGenerated.tau,
  typed: _pureFunctionsNumberGenerated.typed,
  unaryPlus: _pureFunctionsNumberGenerated.unaryPlus,
  'E': _pureFunctionsNumberGenerated.e,
  version: _pureFunctionsNumberGenerated.version,
  xor: _pureFunctionsNumberGenerated.xor,
  abs: _pureFunctionsNumberGenerated.abs,
  acos: _pureFunctionsNumberGenerated.acos,
  acot: _pureFunctionsNumberGenerated.acot,
  acsc: _pureFunctionsNumberGenerated.acsc,
  add: _pureFunctionsNumberGenerated.add,
  and: _pureFunctionsNumberGenerated.and,
  asec: _pureFunctionsNumberGenerated.asec,
  asin: _pureFunctionsNumberGenerated.asin,
  atan: _pureFunctionsNumberGenerated.atan,
  atanh: _pureFunctionsNumberGenerated.atanh,
  bitAnd: _pureFunctionsNumberGenerated.bitAnd,
  bitOr: _pureFunctionsNumberGenerated.bitOr,
  "boolean": _pureFunctionsNumberGenerated["boolean"],
  cbrt: _pureFunctionsNumberGenerated.cbrt,
  chain: chain,
  combinations: _pureFunctionsNumberGenerated.combinations,
  compare: _pureFunctionsNumberGenerated.compare,
  compareText: _pureFunctionsNumberGenerated.compareText,
  cos: _pureFunctionsNumberGenerated.cos,
  cot: _pureFunctionsNumberGenerated.cot,
  csc: _pureFunctionsNumberGenerated.csc,
  cube: _pureFunctionsNumberGenerated.cube,
  divide: _pureFunctionsNumberGenerated.divide,
  equalScalar: _pureFunctionsNumberGenerated.equalScalar,
  erf: _pureFunctionsNumberGenerated.erf,
  exp: _pureFunctionsNumberGenerated.exp,
  filter: _pureFunctionsNumberGenerated.filter,
  fix: _pureFunctionsNumberGenerated.fix,
  forEach: _pureFunctionsNumberGenerated.forEach,
  format: _pureFunctionsNumberGenerated.format,
  gamma: _pureFunctionsNumberGenerated.gamma,
  isInteger: _pureFunctionsNumberGenerated.isInteger,
  isNegative: _pureFunctionsNumberGenerated.isNegative,
  isPositive: _pureFunctionsNumberGenerated.isPositive,
  isZero: _pureFunctionsNumberGenerated.isZero,
  LOG2E: _pureFunctionsNumberGenerated.LOG2E,
  largerEq: _pureFunctionsNumberGenerated.largerEq,
  leftShift: _pureFunctionsNumberGenerated.leftShift,
  log10: _pureFunctionsNumberGenerated.log10,
  log2: _pureFunctionsNumberGenerated.log2,
  map: _pureFunctionsNumberGenerated.map,
  mean: _pureFunctionsNumberGenerated.mean,
  mod: _pureFunctionsNumberGenerated.mod,
  multiply: _pureFunctionsNumberGenerated.multiply,
  not: _pureFunctionsNumberGenerated.not,
  number: _pureFunctionsNumberGenerated.number,
  or: _pureFunctionsNumberGenerated.or,
  pi: _pureFunctionsNumberGenerated.pi,
  pow: _pureFunctionsNumberGenerated.pow,
  random: _pureFunctionsNumberGenerated.random,
  rightArithShift: _pureFunctionsNumberGenerated.rightArithShift,
  round: _pureFunctionsNumberGenerated.round,
  sec: _pureFunctionsNumberGenerated.sec,
  sign: _pureFunctionsNumberGenerated.sign,
  sin: _pureFunctionsNumberGenerated.sin,
  size: _pureFunctionsNumberGenerated.size,
  smallerEq: _pureFunctionsNumberGenerated.smallerEq,
  square: _pureFunctionsNumberGenerated.square,
  string: _pureFunctionsNumberGenerated.string,
  subtract: _pureFunctionsNumberGenerated.subtract,
  tanh: _pureFunctionsNumberGenerated.tanh,
  typeOf: _pureFunctionsNumberGenerated.typeOf,
  unequal: _pureFunctionsNumberGenerated.unequal,
  xgcd: _pureFunctionsNumberGenerated.xgcd,
  acoth: _pureFunctionsNumberGenerated.acoth,
  addScalar: _pureFunctionsNumberGenerated.addScalar,
  asech: _pureFunctionsNumberGenerated.asech,
  bitNot: _pureFunctionsNumberGenerated.bitNot,
  ceil: _pureFunctionsNumberGenerated.ceil,
  combinationsWithRep: _pureFunctionsNumberGenerated.combinationsWithRep,
  cosh: _pureFunctionsNumberGenerated.cosh,
  csch: _pureFunctionsNumberGenerated.csch,
  divideScalar: _pureFunctionsNumberGenerated.divideScalar,
  equalText: _pureFunctionsNumberGenerated.equalText,
  expm1: _pureFunctionsNumberGenerated.expm1,
  isNumeric: _pureFunctionsNumberGenerated.isNumeric,
  LN2: _pureFunctionsNumberGenerated.LN2,
  lcm: _pureFunctionsNumberGenerated.lcm,
  log1p: _pureFunctionsNumberGenerated.log1p,
  multiplyScalar: _pureFunctionsNumberGenerated.multiplyScalar,
  nthRoot: _pureFunctionsNumberGenerated.nthRoot,
  pickRandom: _pureFunctionsNumberGenerated.pickRandom,
  randomInt: _pureFunctionsNumberGenerated.randomInt,
  SQRT2: _pureFunctionsNumberGenerated.SQRT2,
  sinh: _pureFunctionsNumberGenerated.sinh,
  sqrt: _pureFunctionsNumberGenerated.sqrt,
  tan: _pureFunctionsNumberGenerated.tan,
  unaryMinus: _pureFunctionsNumberGenerated.unaryMinus,
  acosh: _pureFunctionsNumberGenerated.acosh,
  apply: _pureFunctionsNumberGenerated.apply,
  asinh: _pureFunctionsNumberGenerated.asinh,
  bitXor: _pureFunctionsNumberGenerated.bitXor,
  catalan: _pureFunctionsNumberGenerated.catalan,
  compareNatural: _pureFunctionsNumberGenerated.compareNatural,
  equal: _pureFunctionsNumberGenerated.equal,
  factorial: _pureFunctionsNumberGenerated.factorial,
  hasNumericValue: _pureFunctionsNumberGenerated.hasNumericValue,
  isNaN: _pureFunctionsNumberGenerated.isNaN,
  larger: _pureFunctionsNumberGenerated.larger,
  mode: _pureFunctionsNumberGenerated.mode,
  norm: _pureFunctionsNumberGenerated.norm,
  partitionSelect: _pureFunctionsNumberGenerated.partitionSelect,
  print: _pureFunctionsNumberGenerated.print,
  quantileSeq: _pureFunctionsNumberGenerated.quantileSeq,
  rightLogShift: _pureFunctionsNumberGenerated.rightLogShift,
  smaller: _pureFunctionsNumberGenerated.smaller,
  stirlingS2: _pureFunctionsNumberGenerated.stirlingS2,
  "true": _pureFunctionsNumberGenerated._true,
  variance: _pureFunctionsNumberGenerated.variance,
  acsch: _pureFunctionsNumberGenerated.acsch,
  atan2: _pureFunctionsNumberGenerated.atan2,
  composition: _pureFunctionsNumberGenerated.composition,
  deepEqual: _pureFunctionsNumberGenerated.deepEqual,
  floor: _pureFunctionsNumberGenerated.floor,
  hypot: _pureFunctionsNumberGenerated.hypot,
  log: _pureFunctionsNumberGenerated.log,
  median: _pureFunctionsNumberGenerated.median,
  multinomial: _pureFunctionsNumberGenerated.multinomial,
  permutations: _pureFunctionsNumberGenerated.permutations,
  range: _pureFunctionsNumberGenerated.range,
  sech: _pureFunctionsNumberGenerated.sech,
  std: _pureFunctionsNumberGenerated.std,
  'PI': _pureFunctionsNumberGenerated.pi,
  clone: _pureFunctionsNumberGenerated.clone,
  coth: _pureFunctionsNumberGenerated.coth,
  gcd: _pureFunctionsNumberGenerated.gcd,
  isPrime: _pureFunctionsNumberGenerated.isPrime,
  numeric: _pureFunctionsNumberGenerated.numeric,
  prod: _pureFunctionsNumberGenerated.prod,
  bellNumbers: _pureFunctionsNumberGenerated.bellNumbers,
  mad: _pureFunctionsNumberGenerated.mad,
  sum: _pureFunctionsNumberGenerated.sum,
  max: _pureFunctionsNumberGenerated.max,
  parse: parse,
  simplify: simplify,
  compile: compile,
  evaluate: evaluate,
  derivative: derivative,
  min: _pureFunctionsNumberGenerated.min,
  rationalize: rationalize,
  help: help,
  parser: parser,
  config: _configReadonly.config
});
(0, _extends2["default"])(mathWithTransform, math, {
  apply: (0, _factoriesNumber.createApplyTransform)({
    isInteger: _pureFunctionsNumberGenerated.isInteger,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  filter: (0, _factoriesNumber.createFilterTransform)({
    typed: _pureFunctionsNumberGenerated.typed
  }),
  forEach: (0, _factoriesNumber.createForEachTransform)({
    typed: _pureFunctionsNumberGenerated.typed
  }),
  map: (0, _factoriesNumber.createMapTransform)({
    typed: _pureFunctionsNumberGenerated.typed
  }),
  mean: (0, _factoriesNumber.createMeanTransform)({
    add: _pureFunctionsNumberGenerated.add,
    divide: _pureFunctionsNumberGenerated.divide,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  subset: (0, _factoriesNumber.createSubsetTransform)({}),
  std: (0, _factoriesNumber.createStdTransform)({
    sqrt: _pureFunctionsNumberGenerated.sqrt,
    typed: _pureFunctionsNumberGenerated.typed,
    variance: _pureFunctionsNumberGenerated.variance
  }),
  sum: (0, _factoriesNumber.createSumTransform)({
    add: _pureFunctionsNumberGenerated.add,
    config: _configReadonly.config,
    numeric: _pureFunctionsNumberGenerated.numeric,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  max: (0, _factoriesNumber.createMaxTransform)({
    config: _configReadonly.config,
    larger: _pureFunctionsNumberGenerated.larger,
    numeric: _pureFunctionsNumberGenerated.numeric,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  min: (0, _factoriesNumber.createMinTransform)({
    config: _configReadonly.config,
    numeric: _pureFunctionsNumberGenerated.numeric,
    smaller: _pureFunctionsNumberGenerated.smaller,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  range: (0, _factoriesNumber.createRangeTransform)({
    matrix: _pureFunctionsNumberGenerated.matrix,
    config: _configReadonly.config,
    larger: _pureFunctionsNumberGenerated.larger,
    largerEq: _pureFunctionsNumberGenerated.largerEq,
    smaller: _pureFunctionsNumberGenerated.smaller,
    smallerEq: _pureFunctionsNumberGenerated.smallerEq,
    typed: _pureFunctionsNumberGenerated.typed
  }),
  variance: (0, _factoriesNumber.createVarianceTransform)({
    add: _pureFunctionsNumberGenerated.add,
    apply: _pureFunctionsNumberGenerated.apply,
    divide: _pureFunctionsNumberGenerated.divide,
    isNaN: _pureFunctionsNumberGenerated.isNaN,
    multiply: _pureFunctionsNumberGenerated.multiply,
    subtract: _pureFunctionsNumberGenerated.subtract,
    typed: _pureFunctionsNumberGenerated.typed
  })
});
(0, _extends2["default"])(classes, {
  Chain: Chain,
  Range: _pureFunctionsNumberGenerated.Range,
  Node: Node,
  ObjectNode: ObjectNode,
  RangeNode: RangeNode,
  RelationalNode: RelationalNode,
  SymbolNode: SymbolNode,
  AccessorNode: AccessorNode,
  AssignmentNode: AssignmentNode,
  ConditionalNode: ConditionalNode,
  FunctionNode: FunctionNode,
  IndexNode: IndexNode,
  OperatorNode: OperatorNode,
  ResultSet: _pureFunctionsNumberGenerated.ResultSet,
  ConstantNode: ConstantNode,
  FunctionAssignmentNode: FunctionAssignmentNode,
  ParenthesisNode: ParenthesisNode,
  BlockNode: BlockNode,
  ArrayNode: ArrayNode,
  Help: Help,
  Parser: Parser
});
Chain.createProxy(math);