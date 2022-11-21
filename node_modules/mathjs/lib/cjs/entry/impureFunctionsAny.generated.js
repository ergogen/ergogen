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

var _factoriesAny = require("../factoriesAny.js");

var _pureFunctionsAnyGenerated = require("./pureFunctionsAny.generated.js");

var _embeddedDocs = require("../expression/embeddedDocs/embeddedDocs.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var math = {}; // NOT pure!

var mathWithTransform = {}; // NOT pure!

var classes = {}; // NOT pure!

var Chain = (0, _factoriesAny.createChainClass)({
  math: math
});
exports.Chain = Chain;
var Node = (0, _factoriesAny.createNode)({
  mathWithTransform: mathWithTransform
});
exports.Node = Node;
var ObjectNode = (0, _factoriesAny.createObjectNode)({
  Node: Node
});
exports.ObjectNode = ObjectNode;
var OperatorNode = (0, _factoriesAny.createOperatorNode)({
  Node: Node
});
exports.OperatorNode = OperatorNode;
var ParenthesisNode = (0, _factoriesAny.createParenthesisNode)({
  Node: Node
});
exports.ParenthesisNode = ParenthesisNode;
var RelationalNode = (0, _factoriesAny.createRelationalNode)({
  Node: Node
});
exports.RelationalNode = RelationalNode;
var ArrayNode = (0, _factoriesAny.createArrayNode)({
  Node: Node
});
exports.ArrayNode = ArrayNode;
var BlockNode = (0, _factoriesAny.createBlockNode)({
  Node: Node,
  ResultSet: _pureFunctionsAnyGenerated.ResultSet
});
exports.BlockNode = BlockNode;
var ConditionalNode = (0, _factoriesAny.createConditionalNode)({
  Node: Node
});
exports.ConditionalNode = ConditionalNode;
var ConstantNode = (0, _factoriesAny.createConstantNode)({
  Node: Node
});
exports.ConstantNode = ConstantNode;
var RangeNode = (0, _factoriesAny.createRangeNode)({
  Node: Node
});
exports.RangeNode = RangeNode;
var reviver = (0, _factoriesAny.createReviver)({
  classes: classes
});
exports.reviver = reviver;
var chain = (0, _factoriesAny.createChain)({
  Chain: Chain,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.chain = chain;
var FunctionAssignmentNode = (0, _factoriesAny.createFunctionAssignmentNode)({
  Node: Node,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.FunctionAssignmentNode = FunctionAssignmentNode;
var AccessorNode = (0, _factoriesAny.createAccessorNode)({
  Node: Node,
  subset: _pureFunctionsAnyGenerated.subset
});
exports.AccessorNode = AccessorNode;
var AssignmentNode = (0, _factoriesAny.createAssignmentNode)({
  matrix: _pureFunctionsAnyGenerated.matrix,
  Node: Node,
  subset: _pureFunctionsAnyGenerated.subset
});
exports.AssignmentNode = AssignmentNode;
var IndexNode = (0, _factoriesAny.createIndexNode)({
  Node: Node,
  Range: _pureFunctionsAnyGenerated.Range,
  size: _pureFunctionsAnyGenerated.size
});
exports.IndexNode = IndexNode;
var SymbolNode = (0, _factoriesAny.createSymbolNode)({
  Unit: _pureFunctionsAnyGenerated.Unit,
  Node: Node,
  math: math
});
exports.SymbolNode = SymbolNode;
var FunctionNode = (0, _factoriesAny.createFunctionNode)({
  Node: Node,
  SymbolNode: SymbolNode,
  math: math
});
exports.FunctionNode = FunctionNode;
var parse = (0, _factoriesAny.createParse)({
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
  numeric: _pureFunctionsAnyGenerated.numeric,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.parse = parse;
var compile = (0, _factoriesAny.createCompile)({
  parse: parse,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.compile = compile;
var evaluate = (0, _factoriesAny.createEvaluate)({
  parse: parse,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.evaluate = evaluate;
var Help = (0, _factoriesAny.createHelpClass)({
  parse: parse
});
exports.Help = Help;
var Parser = (0, _factoriesAny.createParserClass)({
  evaluate: evaluate
});
exports.Parser = Parser;
var parser = (0, _factoriesAny.createParser)({
  Parser: Parser,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.parser = parser;
var simplify = (0, _factoriesAny.createSimplify)({
  bignumber: _pureFunctionsAnyGenerated.bignumber,
  fraction: _pureFunctionsAnyGenerated.fraction,
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: _pureFunctionsAnyGenerated.add,
  config: _configReadonly.config,
  divide: _pureFunctionsAnyGenerated.divide,
  equal: _pureFunctionsAnyGenerated.equal,
  isZero: _pureFunctionsAnyGenerated.isZero,
  mathWithTransform: mathWithTransform,
  multiply: _pureFunctionsAnyGenerated.multiply,
  parse: parse,
  pow: _pureFunctionsAnyGenerated.pow,
  subtract: _pureFunctionsAnyGenerated.subtract,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.simplify = simplify;
var derivative = (0, _factoriesAny.createDerivative)({
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  config: _configReadonly.config,
  equal: _pureFunctionsAnyGenerated.equal,
  isZero: _pureFunctionsAnyGenerated.isZero,
  numeric: _pureFunctionsAnyGenerated.numeric,
  parse: parse,
  simplify: simplify,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.derivative = derivative;
var help = (0, _factoriesAny.createHelp)({
  Help: Help,
  mathWithTransform: mathWithTransform,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.help = help;
var rationalize = (0, _factoriesAny.createRationalize)({
  bignumber: _pureFunctionsAnyGenerated.bignumber,
  fraction: _pureFunctionsAnyGenerated.fraction,
  ConstantNode: ConstantNode,
  FunctionNode: FunctionNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  SymbolNode: SymbolNode,
  add: _pureFunctionsAnyGenerated.add,
  config: _configReadonly.config,
  divide: _pureFunctionsAnyGenerated.divide,
  equal: _pureFunctionsAnyGenerated.equal,
  isZero: _pureFunctionsAnyGenerated.isZero,
  mathWithTransform: mathWithTransform,
  multiply: _pureFunctionsAnyGenerated.multiply,
  parse: parse,
  pow: _pureFunctionsAnyGenerated.pow,
  simplify: simplify,
  subtract: _pureFunctionsAnyGenerated.subtract,
  typed: _pureFunctionsAnyGenerated.typed
});
exports.rationalize = rationalize;
(0, _extends2["default"])(math, {
  e: _pureFunctionsAnyGenerated.e,
  "false": _pureFunctionsAnyGenerated._false,
  fineStructure: _pureFunctionsAnyGenerated.fineStructure,
  i: _pureFunctionsAnyGenerated.i,
  Infinity: _pureFunctionsAnyGenerated._Infinity,
  LN10: _pureFunctionsAnyGenerated.LN10,
  LOG10E: _pureFunctionsAnyGenerated.LOG10E,
  NaN: _pureFunctionsAnyGenerated._NaN,
  "null": _pureFunctionsAnyGenerated._null,
  phi: _pureFunctionsAnyGenerated.phi,
  SQRT1_2: _pureFunctionsAnyGenerated.SQRT1_2,
  sackurTetrode: _pureFunctionsAnyGenerated.sackurTetrode,
  tau: _pureFunctionsAnyGenerated.tau,
  "true": _pureFunctionsAnyGenerated._true,
  'E': _pureFunctionsAnyGenerated.e,
  version: _pureFunctionsAnyGenerated.version,
  efimovFactor: _pureFunctionsAnyGenerated.efimovFactor,
  LN2: _pureFunctionsAnyGenerated.LN2,
  pi: _pureFunctionsAnyGenerated.pi,
  replacer: _pureFunctionsAnyGenerated.replacer,
  reviver: reviver,
  SQRT2: _pureFunctionsAnyGenerated.SQRT2,
  typed: _pureFunctionsAnyGenerated.typed,
  unaryPlus: _pureFunctionsAnyGenerated.unaryPlus,
  'PI': _pureFunctionsAnyGenerated.pi,
  weakMixingAngle: _pureFunctionsAnyGenerated.weakMixingAngle,
  abs: _pureFunctionsAnyGenerated.abs,
  acos: _pureFunctionsAnyGenerated.acos,
  acot: _pureFunctionsAnyGenerated.acot,
  acsc: _pureFunctionsAnyGenerated.acsc,
  addScalar: _pureFunctionsAnyGenerated.addScalar,
  arg: _pureFunctionsAnyGenerated.arg,
  asech: _pureFunctionsAnyGenerated.asech,
  asinh: _pureFunctionsAnyGenerated.asinh,
  atan: _pureFunctionsAnyGenerated.atan,
  atanh: _pureFunctionsAnyGenerated.atanh,
  bignumber: _pureFunctionsAnyGenerated.bignumber,
  bitNot: _pureFunctionsAnyGenerated.bitNot,
  "boolean": _pureFunctionsAnyGenerated["boolean"],
  chain: chain,
  clone: _pureFunctionsAnyGenerated.clone,
  combinations: _pureFunctionsAnyGenerated.combinations,
  complex: _pureFunctionsAnyGenerated.complex,
  conj: _pureFunctionsAnyGenerated.conj,
  cosh: _pureFunctionsAnyGenerated.cosh,
  coth: _pureFunctionsAnyGenerated.coth,
  csc: _pureFunctionsAnyGenerated.csc,
  cube: _pureFunctionsAnyGenerated.cube,
  equalScalar: _pureFunctionsAnyGenerated.equalScalar,
  erf: _pureFunctionsAnyGenerated.erf,
  exp: _pureFunctionsAnyGenerated.exp,
  expm1: _pureFunctionsAnyGenerated.expm1,
  filter: _pureFunctionsAnyGenerated.filter,
  forEach: _pureFunctionsAnyGenerated.forEach,
  format: _pureFunctionsAnyGenerated.format,
  getMatrixDataType: _pureFunctionsAnyGenerated.getMatrixDataType,
  hex: _pureFunctionsAnyGenerated.hex,
  im: _pureFunctionsAnyGenerated.im,
  isInteger: _pureFunctionsAnyGenerated.isInteger,
  isNegative: _pureFunctionsAnyGenerated.isNegative,
  isPositive: _pureFunctionsAnyGenerated.isPositive,
  isZero: _pureFunctionsAnyGenerated.isZero,
  LOG2E: _pureFunctionsAnyGenerated.LOG2E,
  log10: _pureFunctionsAnyGenerated.log10,
  log2: _pureFunctionsAnyGenerated.log2,
  map: _pureFunctionsAnyGenerated.map,
  multiplyScalar: _pureFunctionsAnyGenerated.multiplyScalar,
  not: _pureFunctionsAnyGenerated.not,
  number: _pureFunctionsAnyGenerated.number,
  oct: _pureFunctionsAnyGenerated.oct,
  pickRandom: _pureFunctionsAnyGenerated.pickRandom,
  print: _pureFunctionsAnyGenerated.print,
  random: _pureFunctionsAnyGenerated.random,
  re: _pureFunctionsAnyGenerated.re,
  sec: _pureFunctionsAnyGenerated.sec,
  sign: _pureFunctionsAnyGenerated.sign,
  sin: _pureFunctionsAnyGenerated.sin,
  splitUnit: _pureFunctionsAnyGenerated.splitUnit,
  square: _pureFunctionsAnyGenerated.square,
  string: _pureFunctionsAnyGenerated.string,
  tan: _pureFunctionsAnyGenerated.tan,
  typeOf: _pureFunctionsAnyGenerated.typeOf,
  acosh: _pureFunctionsAnyGenerated.acosh,
  acsch: _pureFunctionsAnyGenerated.acsch,
  apply: _pureFunctionsAnyGenerated.apply,
  asec: _pureFunctionsAnyGenerated.asec,
  bin: _pureFunctionsAnyGenerated.bin,
  combinationsWithRep: _pureFunctionsAnyGenerated.combinationsWithRep,
  cos: _pureFunctionsAnyGenerated.cos,
  csch: _pureFunctionsAnyGenerated.csch,
  isNaN: _pureFunctionsAnyGenerated.isNaN,
  isPrime: _pureFunctionsAnyGenerated.isPrime,
  randomInt: _pureFunctionsAnyGenerated.randomInt,
  sech: _pureFunctionsAnyGenerated.sech,
  sinh: _pureFunctionsAnyGenerated.sinh,
  sparse: _pureFunctionsAnyGenerated.sparse,
  sqrt: _pureFunctionsAnyGenerated.sqrt,
  tanh: _pureFunctionsAnyGenerated.tanh,
  unaryMinus: _pureFunctionsAnyGenerated.unaryMinus,
  acoth: _pureFunctionsAnyGenerated.acoth,
  cot: _pureFunctionsAnyGenerated.cot,
  fraction: _pureFunctionsAnyGenerated.fraction,
  isNumeric: _pureFunctionsAnyGenerated.isNumeric,
  matrix: _pureFunctionsAnyGenerated.matrix,
  matrixFromFunction: _pureFunctionsAnyGenerated.matrixFromFunction,
  mod: _pureFunctionsAnyGenerated.mod,
  nthRoot: _pureFunctionsAnyGenerated.nthRoot,
  numeric: _pureFunctionsAnyGenerated.numeric,
  or: _pureFunctionsAnyGenerated.or,
  prod: _pureFunctionsAnyGenerated.prod,
  reshape: _pureFunctionsAnyGenerated.reshape,
  size: _pureFunctionsAnyGenerated.size,
  smaller: _pureFunctionsAnyGenerated.smaller,
  squeeze: _pureFunctionsAnyGenerated.squeeze,
  subset: _pureFunctionsAnyGenerated.subset,
  subtract: _pureFunctionsAnyGenerated.subtract,
  to: _pureFunctionsAnyGenerated.to,
  transpose: _pureFunctionsAnyGenerated.transpose,
  xgcd: _pureFunctionsAnyGenerated.xgcd,
  zeros: _pureFunctionsAnyGenerated.zeros,
  and: _pureFunctionsAnyGenerated.and,
  bitAnd: _pureFunctionsAnyGenerated.bitAnd,
  bitXor: _pureFunctionsAnyGenerated.bitXor,
  cbrt: _pureFunctionsAnyGenerated.cbrt,
  compare: _pureFunctionsAnyGenerated.compare,
  compareText: _pureFunctionsAnyGenerated.compareText,
  concat: _pureFunctionsAnyGenerated.concat,
  count: _pureFunctionsAnyGenerated.count,
  ctranspose: _pureFunctionsAnyGenerated.ctranspose,
  diag: _pureFunctionsAnyGenerated.diag,
  divideScalar: _pureFunctionsAnyGenerated.divideScalar,
  dotDivide: _pureFunctionsAnyGenerated.dotDivide,
  equal: _pureFunctionsAnyGenerated.equal,
  flatten: _pureFunctionsAnyGenerated.flatten,
  gcd: _pureFunctionsAnyGenerated.gcd,
  hasNumericValue: _pureFunctionsAnyGenerated.hasNumericValue,
  hypot: _pureFunctionsAnyGenerated.hypot,
  kron: _pureFunctionsAnyGenerated.kron,
  largerEq: _pureFunctionsAnyGenerated.largerEq,
  leftShift: _pureFunctionsAnyGenerated.leftShift,
  lsolve: _pureFunctionsAnyGenerated.lsolve,
  matrixFromColumns: _pureFunctionsAnyGenerated.matrixFromColumns,
  min: _pureFunctionsAnyGenerated.min,
  mode: _pureFunctionsAnyGenerated.mode,
  nthRoots: _pureFunctionsAnyGenerated.nthRoots,
  ones: _pureFunctionsAnyGenerated.ones,
  partitionSelect: _pureFunctionsAnyGenerated.partitionSelect,
  resize: _pureFunctionsAnyGenerated.resize,
  rightLogShift: _pureFunctionsAnyGenerated.rightLogShift,
  round: _pureFunctionsAnyGenerated.round,
  smallerEq: _pureFunctionsAnyGenerated.smallerEq,
  unequal: _pureFunctionsAnyGenerated.unequal,
  usolve: _pureFunctionsAnyGenerated.usolve,
  xor: _pureFunctionsAnyGenerated.xor,
  add: _pureFunctionsAnyGenerated.add,
  atan2: _pureFunctionsAnyGenerated.atan2,
  bitOr: _pureFunctionsAnyGenerated.bitOr,
  catalan: _pureFunctionsAnyGenerated.catalan,
  compareNatural: _pureFunctionsAnyGenerated.compareNatural,
  deepEqual: _pureFunctionsAnyGenerated.deepEqual,
  diff: _pureFunctionsAnyGenerated.diff,
  dot: _pureFunctionsAnyGenerated.dot,
  equalText: _pureFunctionsAnyGenerated.equalText,
  floor: _pureFunctionsAnyGenerated.floor,
  identity: _pureFunctionsAnyGenerated.identity,
  larger: _pureFunctionsAnyGenerated.larger,
  log: _pureFunctionsAnyGenerated.log,
  lsolveAll: _pureFunctionsAnyGenerated.lsolveAll,
  matrixFromRows: _pureFunctionsAnyGenerated.matrixFromRows,
  multiply: _pureFunctionsAnyGenerated.multiply,
  pow: _pureFunctionsAnyGenerated.pow,
  qr: _pureFunctionsAnyGenerated.qr,
  range: _pureFunctionsAnyGenerated.range,
  rightArithShift: _pureFunctionsAnyGenerated.rightArithShift,
  row: _pureFunctionsAnyGenerated.row,
  setCartesian: _pureFunctionsAnyGenerated.setCartesian,
  setDistinct: _pureFunctionsAnyGenerated.setDistinct,
  setIsSubset: _pureFunctionsAnyGenerated.setIsSubset,
  setPowerset: _pureFunctionsAnyGenerated.setPowerset,
  slu: _pureFunctionsAnyGenerated.slu,
  sum: _pureFunctionsAnyGenerated.sum,
  trace: _pureFunctionsAnyGenerated.trace,
  usolveAll: _pureFunctionsAnyGenerated.usolveAll,
  asin: _pureFunctionsAnyGenerated.asin,
  ceil: _pureFunctionsAnyGenerated.ceil,
  column: _pureFunctionsAnyGenerated.column,
  composition: _pureFunctionsAnyGenerated.composition,
  cross: _pureFunctionsAnyGenerated.cross,
  distance: _pureFunctionsAnyGenerated.distance,
  dotMultiply: _pureFunctionsAnyGenerated.dotMultiply,
  fix: _pureFunctionsAnyGenerated.fix,
  gamma: _pureFunctionsAnyGenerated.gamma,
  index: _pureFunctionsAnyGenerated.index,
  lcm: _pureFunctionsAnyGenerated.lcm,
  max: _pureFunctionsAnyGenerated.max,
  quantileSeq: _pureFunctionsAnyGenerated.quantileSeq,
  setDifference: _pureFunctionsAnyGenerated.setDifference,
  setMultiplicity: _pureFunctionsAnyGenerated.setMultiplicity,
  setSymDifference: _pureFunctionsAnyGenerated.setSymDifference,
  sort: _pureFunctionsAnyGenerated.sort,
  vacuumImpedance: _pureFunctionsAnyGenerated.vacuumImpedance,
  wienDisplacement: _pureFunctionsAnyGenerated.wienDisplacement,
  atomicMass: _pureFunctionsAnyGenerated.atomicMass,
  bohrMagneton: _pureFunctionsAnyGenerated.bohrMagneton,
  boltzmann: _pureFunctionsAnyGenerated.boltzmann,
  conductanceQuantum: _pureFunctionsAnyGenerated.conductanceQuantum,
  createUnit: _pureFunctionsAnyGenerated.createUnit,
  deuteronMass: _pureFunctionsAnyGenerated.deuteronMass,
  dotPow: _pureFunctionsAnyGenerated.dotPow,
  electricConstant: _pureFunctionsAnyGenerated.electricConstant,
  elementaryCharge: _pureFunctionsAnyGenerated.elementaryCharge,
  factorial: _pureFunctionsAnyGenerated.factorial,
  fermiCoupling: _pureFunctionsAnyGenerated.fermiCoupling,
  gasConstant: _pureFunctionsAnyGenerated.gasConstant,
  gravity: _pureFunctionsAnyGenerated.gravity,
  intersect: _pureFunctionsAnyGenerated.intersect,
  inverseConductanceQuantum: _pureFunctionsAnyGenerated.inverseConductanceQuantum,
  klitzing: _pureFunctionsAnyGenerated.klitzing,
  loschmidt: _pureFunctionsAnyGenerated.loschmidt,
  magneticConstant: _pureFunctionsAnyGenerated.magneticConstant,
  molarMass: _pureFunctionsAnyGenerated.molarMass,
  molarPlanckConstant: _pureFunctionsAnyGenerated.molarPlanckConstant,
  neutronMass: _pureFunctionsAnyGenerated.neutronMass,
  nuclearMagneton: _pureFunctionsAnyGenerated.nuclearMagneton,
  permutations: _pureFunctionsAnyGenerated.permutations,
  planckConstant: _pureFunctionsAnyGenerated.planckConstant,
  planckMass: _pureFunctionsAnyGenerated.planckMass,
  planckTime: _pureFunctionsAnyGenerated.planckTime,
  quantumOfCirculation: _pureFunctionsAnyGenerated.quantumOfCirculation,
  reducedPlanckConstant: _pureFunctionsAnyGenerated.reducedPlanckConstant,
  rydberg: _pureFunctionsAnyGenerated.rydberg,
  setIntersect: _pureFunctionsAnyGenerated.setIntersect,
  setUnion: _pureFunctionsAnyGenerated.setUnion,
  stefanBoltzmann: _pureFunctionsAnyGenerated.stefanBoltzmann,
  unit: _pureFunctionsAnyGenerated.unit,
  avogadro: _pureFunctionsAnyGenerated.avogadro,
  bohrRadius: _pureFunctionsAnyGenerated.bohrRadius,
  coulomb: _pureFunctionsAnyGenerated.coulomb,
  electronMass: _pureFunctionsAnyGenerated.electronMass,
  faraday: _pureFunctionsAnyGenerated.faraday,
  hartreeEnergy: _pureFunctionsAnyGenerated.hartreeEnergy,
  log1p: _pureFunctionsAnyGenerated.log1p,
  magneticFluxQuantum: _pureFunctionsAnyGenerated.magneticFluxQuantum,
  molarMassC12: _pureFunctionsAnyGenerated.molarMassC12,
  parse: parse,
  planckCharge: _pureFunctionsAnyGenerated.planckCharge,
  planckTemperature: _pureFunctionsAnyGenerated.planckTemperature,
  secondRadiation: _pureFunctionsAnyGenerated.secondRadiation,
  speedOfLight: _pureFunctionsAnyGenerated.speedOfLight,
  stirlingS2: _pureFunctionsAnyGenerated.stirlingS2,
  bellNumbers: _pureFunctionsAnyGenerated.bellNumbers,
  compile: compile,
  evaluate: evaluate,
  firstRadiation: _pureFunctionsAnyGenerated.firstRadiation,
  lup: _pureFunctionsAnyGenerated.lup,
  molarVolume: _pureFunctionsAnyGenerated.molarVolume,
  protonMass: _pureFunctionsAnyGenerated.protonMass,
  setSize: _pureFunctionsAnyGenerated.setSize,
  thomsonCrossSection: _pureFunctionsAnyGenerated.thomsonCrossSection,
  classicalElectronRadius: _pureFunctionsAnyGenerated.classicalElectronRadius,
  det: _pureFunctionsAnyGenerated.det,
  gravitationConstant: _pureFunctionsAnyGenerated.gravitationConstant,
  inv: _pureFunctionsAnyGenerated.inv,
  lusolve: _pureFunctionsAnyGenerated.lusolve,
  parser: parser,
  sqrtm: _pureFunctionsAnyGenerated.sqrtm,
  divide: _pureFunctionsAnyGenerated.divide,
  expm: _pureFunctionsAnyGenerated.expm,
  kldivergence: _pureFunctionsAnyGenerated.kldivergence,
  mean: _pureFunctionsAnyGenerated.mean,
  median: _pureFunctionsAnyGenerated.median,
  planckLength: _pureFunctionsAnyGenerated.planckLength,
  simplify: simplify,
  variance: _pureFunctionsAnyGenerated.variance,
  derivative: derivative,
  help: help,
  rationalize: rationalize,
  std: _pureFunctionsAnyGenerated.std,
  eigs: _pureFunctionsAnyGenerated.eigs,
  multinomial: _pureFunctionsAnyGenerated.multinomial,
  mad: _pureFunctionsAnyGenerated.mad,
  norm: _pureFunctionsAnyGenerated.norm,
  rotationMatrix: _pureFunctionsAnyGenerated.rotationMatrix,
  rotate: _pureFunctionsAnyGenerated.rotate,
  config: _configReadonly.config
});
(0, _extends2["default"])(mathWithTransform, math, {
  filter: (0, _factoriesAny.createFilterTransform)({
    typed: _pureFunctionsAnyGenerated.typed
  }),
  forEach: (0, _factoriesAny.createForEachTransform)({
    typed: _pureFunctionsAnyGenerated.typed
  }),
  map: (0, _factoriesAny.createMapTransform)({
    typed: _pureFunctionsAnyGenerated.typed
  }),
  apply: (0, _factoriesAny.createApplyTransform)({
    isInteger: _pureFunctionsAnyGenerated.isInteger,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  diff: (0, _factoriesAny.createDiffTransform)({
    bignumber: _pureFunctionsAnyGenerated.bignumber,
    matrix: _pureFunctionsAnyGenerated.matrix,
    number: _pureFunctionsAnyGenerated.number,
    subtract: _pureFunctionsAnyGenerated.subtract,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  index: (0, _factoriesAny.createIndexTransform)({
    Index: _pureFunctionsAnyGenerated.Index
  }),
  subset: (0, _factoriesAny.createSubsetTransform)({
    matrix: _pureFunctionsAnyGenerated.matrix,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  concat: (0, _factoriesAny.createConcatTransform)({
    isInteger: _pureFunctionsAnyGenerated.isInteger,
    matrix: _pureFunctionsAnyGenerated.matrix,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  max: (0, _factoriesAny.createMaxTransform)({
    config: _configReadonly.config,
    larger: _pureFunctionsAnyGenerated.larger,
    numeric: _pureFunctionsAnyGenerated.numeric,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  min: (0, _factoriesAny.createMinTransform)({
    config: _configReadonly.config,
    numeric: _pureFunctionsAnyGenerated.numeric,
    smaller: _pureFunctionsAnyGenerated.smaller,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  range: (0, _factoriesAny.createRangeTransform)({
    bignumber: _pureFunctionsAnyGenerated.bignumber,
    matrix: _pureFunctionsAnyGenerated.matrix,
    config: _configReadonly.config,
    larger: _pureFunctionsAnyGenerated.larger,
    largerEq: _pureFunctionsAnyGenerated.largerEq,
    smaller: _pureFunctionsAnyGenerated.smaller,
    smallerEq: _pureFunctionsAnyGenerated.smallerEq,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  row: (0, _factoriesAny.createRowTransform)({
    Index: _pureFunctionsAnyGenerated.Index,
    matrix: _pureFunctionsAnyGenerated.matrix,
    range: _pureFunctionsAnyGenerated.range,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  sum: (0, _factoriesAny.createSumTransform)({
    add: _pureFunctionsAnyGenerated.add,
    config: _configReadonly.config,
    numeric: _pureFunctionsAnyGenerated.numeric,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  column: (0, _factoriesAny.createColumnTransform)({
    Index: _pureFunctionsAnyGenerated.Index,
    matrix: _pureFunctionsAnyGenerated.matrix,
    range: _pureFunctionsAnyGenerated.range,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  mean: (0, _factoriesAny.createMeanTransform)({
    add: _pureFunctionsAnyGenerated.add,
    divide: _pureFunctionsAnyGenerated.divide,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  variance: (0, _factoriesAny.createVarianceTransform)({
    add: _pureFunctionsAnyGenerated.add,
    apply: _pureFunctionsAnyGenerated.apply,
    divide: _pureFunctionsAnyGenerated.divide,
    isNaN: _pureFunctionsAnyGenerated.isNaN,
    multiply: _pureFunctionsAnyGenerated.multiply,
    subtract: _pureFunctionsAnyGenerated.subtract,
    typed: _pureFunctionsAnyGenerated.typed
  }),
  std: (0, _factoriesAny.createStdTransform)({
    sqrt: _pureFunctionsAnyGenerated.sqrt,
    typed: _pureFunctionsAnyGenerated.typed,
    variance: _pureFunctionsAnyGenerated.variance
  })
});
(0, _extends2["default"])(classes, {
  BigNumber: _pureFunctionsAnyGenerated.BigNumber,
  Chain: Chain,
  Complex: _pureFunctionsAnyGenerated.Complex,
  Fraction: _pureFunctionsAnyGenerated.Fraction,
  Matrix: _pureFunctionsAnyGenerated.Matrix,
  Node: Node,
  ObjectNode: ObjectNode,
  OperatorNode: OperatorNode,
  ParenthesisNode: ParenthesisNode,
  Range: _pureFunctionsAnyGenerated.Range,
  RelationalNode: RelationalNode,
  ResultSet: _pureFunctionsAnyGenerated.ResultSet,
  ArrayNode: ArrayNode,
  BlockNode: BlockNode,
  ConditionalNode: ConditionalNode,
  ConstantNode: ConstantNode,
  DenseMatrix: _pureFunctionsAnyGenerated.DenseMatrix,
  RangeNode: RangeNode,
  FunctionAssignmentNode: FunctionAssignmentNode,
  SparseMatrix: _pureFunctionsAnyGenerated.SparseMatrix,
  AccessorNode: AccessorNode,
  AssignmentNode: AssignmentNode,
  ImmutableDenseMatrix: _pureFunctionsAnyGenerated.ImmutableDenseMatrix,
  Index: _pureFunctionsAnyGenerated.Index,
  IndexNode: IndexNode,
  FibonacciHeap: _pureFunctionsAnyGenerated.FibonacciHeap,
  Unit: _pureFunctionsAnyGenerated.Unit,
  Spa: _pureFunctionsAnyGenerated.Spa,
  SymbolNode: SymbolNode,
  FunctionNode: FunctionNode,
  Help: Help,
  Parser: Parser
});
Chain.createProxy(math);