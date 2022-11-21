import _extends from "@babel/runtime/helpers/extends";

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import { config } from './configReadonly.js';
import { createChainClass, createNode, createObjectNode, createOperatorNode, createParenthesisNode, createRelationalNode, createArrayNode, createBlockNode, createConditionalNode, createConstantNode, createRangeNode, createReviver, createChain, createFunctionAssignmentNode, createAccessorNode, createAssignmentNode, createIndexNode, createSymbolNode, createFunctionNode, createParse, createCompile, createEvaluate, createHelpClass, createParserClass, createParser, createSimplify, createDerivative, createHelp, createRationalize, createFilterTransform, createForEachTransform, createMapTransform, createApplyTransform, createDiffTransform, createIndexTransform, createSubsetTransform, createConcatTransform, createMaxTransform, createMinTransform, createRangeTransform, createRowTransform, createSumTransform, createColumnTransform, createMeanTransform, createVarianceTransform, createStdTransform } from '../factoriesAny.js';
import { BigNumber, Complex, e, _false, fineStructure, Fraction, i, _Infinity, LN10, LOG10E, Matrix, _NaN, _null, phi, Range, ResultSet, SQRT1_2, // eslint-disable-line camelcase
sackurTetrode, tau, _true, version, DenseMatrix, efimovFactor, LN2, pi, replacer, SQRT2, typed, unaryPlus, weakMixingAngle, abs, acos, acot, acsc, addScalar, arg, asech, asinh, atan, atanh, bignumber, bitNot, boolean, clone, combinations, complex, conj, cosh, coth, csc, cube, equalScalar, erf, exp, expm1, filter, forEach, format, getMatrixDataType, hex, im, isInteger, isNegative, isPositive, isZero, LOG2E, log10, log2, map, multiplyScalar, not, number, oct, pickRandom, print, random, re, sec, sign, sin, SparseMatrix, splitUnit, square, string, tan, typeOf, acosh, acsch, apply, asec, bin, combinationsWithRep, cos, csch, isNaN, isPrime, randomInt, sech, sinh, sparse, sqrt, tanh, unaryMinus, acoth, cot, fraction, isNumeric, matrix, matrixFromFunction, mod, nthRoot, numeric, or, prod, reshape, size, smaller, squeeze, subset, subtract, to, transpose, xgcd, zeros, and, bitAnd, bitXor, cbrt, compare, compareText, concat, count, ctranspose, diag, divideScalar, dotDivide, equal, flatten, gcd, hasNumericValue, hypot, ImmutableDenseMatrix, Index, kron, largerEq, leftShift, lsolve, matrixFromColumns, min, mode, nthRoots, ones, partitionSelect, resize, rightLogShift, round, smallerEq, unequal, usolve, xor, add, atan2, bitOr, catalan, compareNatural, deepEqual, diff, dot, equalText, floor, identity, larger, log, lsolveAll, matrixFromRows, multiply, pow, qr, range, rightArithShift, row, setCartesian, setDistinct, setIsSubset, setPowerset, slu, sum, trace, usolveAll, asin, ceil, column, composition, cross, distance, dotMultiply, FibonacciHeap, fix, gamma, index, lcm, max, quantileSeq, setDifference, setMultiplicity, setSymDifference, sort, Unit, vacuumImpedance, wienDisplacement, atomicMass, bohrMagneton, boltzmann, conductanceQuantum, createUnit, deuteronMass, dotPow, electricConstant, elementaryCharge, factorial, fermiCoupling, gasConstant, gravity, intersect, inverseConductanceQuantum, klitzing, loschmidt, magneticConstant, molarMass, molarPlanckConstant, neutronMass, nuclearMagneton, permutations, planckConstant, planckMass, planckTime, quantumOfCirculation, reducedPlanckConstant, rydberg, setIntersect, setUnion, Spa, stefanBoltzmann, unit, avogadro, bohrRadius, coulomb, electronMass, faraday, hartreeEnergy, log1p, magneticFluxQuantum, molarMassC12, planckCharge, planckTemperature, secondRadiation, speedOfLight, stirlingS2, bellNumbers, firstRadiation, lup, molarVolume, protonMass, setSize, thomsonCrossSection, classicalElectronRadius, det, gravitationConstant, inv, lusolve, sqrtm, divide, expm, kldivergence, mean, median, planckLength, variance, std, eigs, multinomial, mad, norm, rotationMatrix, rotate } from './pureFunctionsAny.generated.js';
var math = {}; // NOT pure!

var mathWithTransform = {}; // NOT pure!

var classes = {}; // NOT pure!

export var Chain = createChainClass({
  math
});
export var Node = createNode({
  mathWithTransform
});
export var ObjectNode = createObjectNode({
  Node
});
export var OperatorNode = createOperatorNode({
  Node
});
export var ParenthesisNode = createParenthesisNode({
  Node
});
export var RelationalNode = createRelationalNode({
  Node
});
export var ArrayNode = createArrayNode({
  Node
});
export var BlockNode = createBlockNode({
  Node,
  ResultSet
});
export var ConditionalNode = createConditionalNode({
  Node
});
export var ConstantNode = createConstantNode({
  Node
});
export var RangeNode = createRangeNode({
  Node
});
export var reviver = createReviver({
  classes
});
export var chain = createChain({
  Chain,
  typed
});
export var FunctionAssignmentNode = createFunctionAssignmentNode({
  Node,
  typed
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
export var IndexNode = createIndexNode({
  Node,
  Range,
  size
});
export var SymbolNode = createSymbolNode({
  Unit,
  Node,
  math
});
export var FunctionNode = createFunctionNode({
  Node,
  SymbolNode,
  math
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
export var parser = createParser({
  Parser,
  typed
});
export var simplify = createSimplify({
  bignumber,
  fraction,
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
export var help = createHelp({
  Help,
  mathWithTransform,
  typed
});
export var rationalize = createRationalize({
  bignumber,
  fraction,
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

_extends(math, {
  e,
  false: _false,
  fineStructure,
  i,
  Infinity: _Infinity,
  LN10,
  LOG10E,
  NaN: _NaN,
  null: _null,
  phi,
  SQRT1_2,
  sackurTetrode,
  tau,
  true: _true,
  'E': e,
  version,
  efimovFactor,
  LN2,
  pi,
  replacer,
  reviver,
  SQRT2,
  typed,
  unaryPlus,
  'PI': pi,
  weakMixingAngle,
  abs,
  acos,
  acot,
  acsc,
  addScalar,
  arg,
  asech,
  asinh,
  atan,
  atanh,
  bignumber,
  bitNot,
  boolean,
  chain,
  clone,
  combinations,
  complex,
  conj,
  cosh,
  coth,
  csc,
  cube,
  equalScalar,
  erf,
  exp,
  expm1,
  filter,
  forEach,
  format,
  getMatrixDataType,
  hex,
  im,
  isInteger,
  isNegative,
  isPositive,
  isZero,
  LOG2E,
  log10,
  log2,
  map,
  multiplyScalar,
  not,
  number,
  oct,
  pickRandom,
  print,
  random,
  re,
  sec,
  sign,
  sin,
  splitUnit,
  square,
  string,
  tan,
  typeOf,
  acosh,
  acsch,
  apply,
  asec,
  bin,
  combinationsWithRep,
  cos,
  csch,
  isNaN,
  isPrime,
  randomInt,
  sech,
  sinh,
  sparse,
  sqrt,
  tanh,
  unaryMinus,
  acoth,
  cot,
  fraction,
  isNumeric,
  matrix,
  matrixFromFunction,
  mod,
  nthRoot,
  numeric,
  or,
  prod,
  reshape,
  size,
  smaller,
  squeeze,
  subset,
  subtract,
  to,
  transpose,
  xgcd,
  zeros,
  and,
  bitAnd,
  bitXor,
  cbrt,
  compare,
  compareText,
  concat,
  count,
  ctranspose,
  diag,
  divideScalar,
  dotDivide,
  equal,
  flatten,
  gcd,
  hasNumericValue,
  hypot,
  kron,
  largerEq,
  leftShift,
  lsolve,
  matrixFromColumns,
  min,
  mode,
  nthRoots,
  ones,
  partitionSelect,
  resize,
  rightLogShift,
  round,
  smallerEq,
  unequal,
  usolve,
  xor,
  add,
  atan2,
  bitOr,
  catalan,
  compareNatural,
  deepEqual,
  diff,
  dot,
  equalText,
  floor,
  identity,
  larger,
  log,
  lsolveAll,
  matrixFromRows,
  multiply,
  pow,
  qr,
  range,
  rightArithShift,
  row,
  setCartesian,
  setDistinct,
  setIsSubset,
  setPowerset,
  slu,
  sum,
  trace,
  usolveAll,
  asin,
  ceil,
  column,
  composition,
  cross,
  distance,
  dotMultiply,
  fix,
  gamma,
  index,
  lcm,
  max,
  quantileSeq,
  setDifference,
  setMultiplicity,
  setSymDifference,
  sort,
  vacuumImpedance,
  wienDisplacement,
  atomicMass,
  bohrMagneton,
  boltzmann,
  conductanceQuantum,
  createUnit,
  deuteronMass,
  dotPow,
  electricConstant,
  elementaryCharge,
  factorial,
  fermiCoupling,
  gasConstant,
  gravity,
  intersect,
  inverseConductanceQuantum,
  klitzing,
  loschmidt,
  magneticConstant,
  molarMass,
  molarPlanckConstant,
  neutronMass,
  nuclearMagneton,
  permutations,
  planckConstant,
  planckMass,
  planckTime,
  quantumOfCirculation,
  reducedPlanckConstant,
  rydberg,
  setIntersect,
  setUnion,
  stefanBoltzmann,
  unit,
  avogadro,
  bohrRadius,
  coulomb,
  electronMass,
  faraday,
  hartreeEnergy,
  log1p,
  magneticFluxQuantum,
  molarMassC12,
  parse,
  planckCharge,
  planckTemperature,
  secondRadiation,
  speedOfLight,
  stirlingS2,
  bellNumbers,
  compile,
  evaluate,
  firstRadiation,
  lup,
  molarVolume,
  protonMass,
  setSize,
  thomsonCrossSection,
  classicalElectronRadius,
  det,
  gravitationConstant,
  inv,
  lusolve,
  parser,
  sqrtm,
  divide,
  expm,
  kldivergence,
  mean,
  median,
  planckLength,
  simplify,
  variance,
  derivative,
  help,
  rationalize,
  std,
  eigs,
  multinomial,
  mad,
  norm,
  rotationMatrix,
  rotate,
  config
});

_extends(mathWithTransform, math, {
  filter: createFilterTransform({
    typed
  }),
  forEach: createForEachTransform({
    typed
  }),
  map: createMapTransform({
    typed
  }),
  apply: createApplyTransform({
    isInteger,
    typed
  }),
  diff: createDiffTransform({
    bignumber,
    matrix,
    number,
    subtract,
    typed
  }),
  index: createIndexTransform({
    Index
  }),
  subset: createSubsetTransform({
    matrix,
    typed
  }),
  concat: createConcatTransform({
    isInteger,
    matrix,
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
    bignumber,
    matrix,
    config,
    larger,
    largerEq,
    smaller,
    smallerEq,
    typed
  }),
  row: createRowTransform({
    Index,
    matrix,
    range,
    typed
  }),
  sum: createSumTransform({
    add,
    config,
    numeric,
    typed
  }),
  column: createColumnTransform({
    Index,
    matrix,
    range,
    typed
  }),
  mean: createMeanTransform({
    add,
    divide,
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
  }),
  std: createStdTransform({
    sqrt,
    typed,
    variance
  })
});

_extends(classes, {
  BigNumber,
  Chain,
  Complex,
  Fraction,
  Matrix,
  Node,
  ObjectNode,
  OperatorNode,
  ParenthesisNode,
  Range,
  RelationalNode,
  ResultSet,
  ArrayNode,
  BlockNode,
  ConditionalNode,
  ConstantNode,
  DenseMatrix,
  RangeNode,
  FunctionAssignmentNode,
  SparseMatrix,
  AccessorNode,
  AssignmentNode,
  ImmutableDenseMatrix,
  Index,
  IndexNode,
  FibonacciHeap,
  Unit,
  Spa,
  SymbolNode,
  FunctionNode,
  Help,
  Parser
});

Chain.createProxy(math);
export { embeddedDocs as docs } from '../expression/embeddedDocs/embeddedDocs.js';