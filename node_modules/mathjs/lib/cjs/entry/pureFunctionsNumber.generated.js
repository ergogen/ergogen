"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multinomial = exports.mode = exports.mod = exports.min = exports.median = exports.mean = exports.max = exports.matrix = exports.map = exports.mad = exports.log2 = exports.log1p = exports.log10 = exports.log = exports.leftShift = exports.lcm = exports.largerEq = exports.larger = exports.isZero = exports.isPrime = exports.isPositive = exports.isNumeric = exports.isNegative = exports.isNaN = exports.isInteger = exports.index = exports.hypot = exports.hasNumericValue = exports.gcd = exports.gamma = exports.format = exports.forEach = exports.floor = exports.fix = exports.filter = exports.factorial = exports.expm1 = exports.exp = exports.erf = exports.equalText = exports.equalScalar = exports.equal = exports.e = exports.divideScalar = exports.divide = exports.deepEqual = exports.cube = exports.csch = exports.csc = exports.coth = exports.cot = exports.cosh = exports.cos = exports.composition = exports.compareText = exports.compareNatural = exports.compare = exports.combinationsWithRep = exports.combinations = exports.clone = exports.ceil = exports.cbrt = exports.catalan = exports["boolean"] = exports.bitXor = exports.bitOr = exports.bitNot = exports.bitAnd = exports.bellNumbers = exports.atanh = exports.atan2 = exports.atan = exports.asinh = exports.asin = exports.asech = exports.asec = exports.apply = exports.and = exports.addScalar = exports.add = exports.acsch = exports.acsc = exports.acoth = exports.acot = exports.acosh = exports.acos = exports.abs = exports._true = exports._null = exports._false = exports._NaN = exports._Infinity = exports.SQRT2 = exports.SQRT1_2 = exports.ResultSet = exports.Range = exports.LOG2E = exports.LOG10E = exports.LN2 = exports.LN10 = void 0;
exports.xor = exports.xgcd = exports.version = exports.variance = exports.unequal = exports.unaryPlus = exports.unaryMinus = exports.typed = exports.typeOf = exports.tau = exports.tanh = exports.tan = exports.sum = exports.subtract = exports.subset = exports.string = exports.stirlingS2 = exports.std = exports.square = exports.sqrt = exports.smallerEq = exports.smaller = exports.size = exports.sinh = exports.sin = exports.sign = exports.sech = exports.sec = exports.round = exports.rightLogShift = exports.rightArithShift = exports.replacer = exports.range = exports.randomInt = exports.random = exports.quantileSeq = exports.prod = exports.print = exports.pow = exports.pickRandom = exports.pi = exports.phi = exports.permutations = exports.partitionSelect = exports.or = exports.numeric = exports.number = exports.nthRoot = exports.not = exports.norm = exports.multiplyScalar = exports.multiply = exports.multinomial = exports.mode = exports.mod = exports.min = exports.median = exports.mean = exports.max = exports.matrix = exports.map = exports.mad = exports.log2 = exports.log1p = exports.log10 = exports.log = exports.leftShift = exports.lcm = exports.largerEq = exports.larger = exports.isZero = exports.isPrime = exports.isPositive = exports.isNumeric = exports.isNegative = exports.isNaN = exports.isInteger = exports.index = exports.hypot = exports.hasNumericValue = exports.gcd = exports.gamma = exports.format = exports.forEach = exports.floor = exports.fix = exports.filter = exports.factorial = exports.expm1 = exports.exp = exports.erf = exports.equalText = exports.equalScalar = exports.equal = exports.e = exports.divideScalar = exports.divide = exports.deepEqual = exports.cube = exports.csch = exports.csc = exports.coth = exports.cot = exports.cosh = exports.cos = exports.composition = exports.compareText = exports.compareNatural = exports.compare = exports.combinationsWithRep = exports.combinations = exports.clone = exports.ceil = exports.cbrt = exports.catalan = exports["boolean"] = exports.bitXor = exports.bitOr = exports.bitNot = exports.bitAnd = exports.bellNumbers = exports.atanh = exports.atan2 = exports.atan = exports.asinh = exports.asin = exports.asech = exports.asec = exports.apply = exports.and = exports.addScalar = exports.add = exports.acsch = exports.acsc = exports.acoth = exports.acot = exports.acosh = exports.acos = exports.abs = exports._true = exports._null = exports._false = exports._NaN = exports._Infinity = exports.SQRT2 = exports.SQRT1_2 = exports.ResultSet = exports.Range = exports.LOG2E = exports.LOG10E = exports.LN2 = exports.LN10 = void 0;

var _configReadonly = require("./configReadonly.js");

var _factoriesNumber = require("../factoriesNumber.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var e = /* #__PURE__ */(0, _factoriesNumber.createE)({
  config: _configReadonly.config
});
exports.e = e;

var _false = /* #__PURE__ */(0, _factoriesNumber.createFalse)({});

exports._false = _false;
var index = /* #__PURE__ */(0, _factoriesNumber.createIndex)({});
exports.index = index;

var _Infinity = /* #__PURE__ */(0, _factoriesNumber.createInfinity)({
  config: _configReadonly.config
});

exports._Infinity = _Infinity;
var LN10 = /* #__PURE__ */(0, _factoriesNumber.createLN10)({
  config: _configReadonly.config
});
exports.LN10 = LN10;
var LOG10E = /* #__PURE__ */(0, _factoriesNumber.createLOG10E)({
  config: _configReadonly.config
});
exports.LOG10E = LOG10E;
var matrix = /* #__PURE__ */(0, _factoriesNumber.createMatrix)({});
exports.matrix = matrix;

var _NaN = /* #__PURE__ */(0, _factoriesNumber.createNaN)({
  config: _configReadonly.config
});

exports._NaN = _NaN;

var _null = /* #__PURE__ */(0, _factoriesNumber.createNull)({});

exports._null = _null;
var phi = /* #__PURE__ */(0, _factoriesNumber.createPhi)({
  config: _configReadonly.config
});
exports.phi = phi;
var Range = /* #__PURE__ */(0, _factoriesNumber.createRangeClass)({});
exports.Range = Range;
var replacer = /* #__PURE__ */(0, _factoriesNumber.createReplacer)({});
exports.replacer = replacer;
var SQRT1_2 = /* #__PURE__ */(0, _factoriesNumber.createSQRT1_2)({
  config: _configReadonly.config
});
exports.SQRT1_2 = SQRT1_2;
var subset = /* #__PURE__ */(0, _factoriesNumber.createSubset)({});
exports.subset = subset;
var tau = /* #__PURE__ */(0, _factoriesNumber.createTau)({
  config: _configReadonly.config
});
exports.tau = tau;
var typed = /* #__PURE__ */(0, _factoriesNumber.createTyped)({});
exports.typed = typed;
var unaryPlus = /* #__PURE__ */(0, _factoriesNumber.createUnaryPlus)({
  typed: typed
});
exports.unaryPlus = unaryPlus;
var version = /* #__PURE__ */(0, _factoriesNumber.createVersion)({});
exports.version = version;
var xor = /* #__PURE__ */(0, _factoriesNumber.createXor)({
  typed: typed
});
exports.xor = xor;
var abs = /* #__PURE__ */(0, _factoriesNumber.createAbs)({
  typed: typed
});
exports.abs = abs;
var acos = /* #__PURE__ */(0, _factoriesNumber.createAcos)({
  typed: typed
});
exports.acos = acos;
var acot = /* #__PURE__ */(0, _factoriesNumber.createAcot)({
  typed: typed
});
exports.acot = acot;
var acsc = /* #__PURE__ */(0, _factoriesNumber.createAcsc)({
  typed: typed
});
exports.acsc = acsc;
var add = /* #__PURE__ */(0, _factoriesNumber.createAdd)({
  typed: typed
});
exports.add = add;
var and = /* #__PURE__ */(0, _factoriesNumber.createAnd)({
  typed: typed
});
exports.and = and;
var asec = /* #__PURE__ */(0, _factoriesNumber.createAsec)({
  typed: typed
});
exports.asec = asec;
var asin = /* #__PURE__ */(0, _factoriesNumber.createAsin)({
  typed: typed
});
exports.asin = asin;
var atan = /* #__PURE__ */(0, _factoriesNumber.createAtan)({
  typed: typed
});
exports.atan = atan;
var atanh = /* #__PURE__ */(0, _factoriesNumber.createAtanh)({
  typed: typed
});
exports.atanh = atanh;
var bitAnd = /* #__PURE__ */(0, _factoriesNumber.createBitAnd)({
  typed: typed
});
exports.bitAnd = bitAnd;
var bitOr = /* #__PURE__ */(0, _factoriesNumber.createBitOr)({
  typed: typed
});
exports.bitOr = bitOr;

var _boolean = /* #__PURE__ */(0, _factoriesNumber.createBoolean)({
  typed: typed
});

exports["boolean"] = _boolean;
var cbrt = /* #__PURE__ */(0, _factoriesNumber.createCbrt)({
  typed: typed
});
exports.cbrt = cbrt;
var combinations = /* #__PURE__ */(0, _factoriesNumber.createCombinations)({
  typed: typed
});
exports.combinations = combinations;
var compare = /* #__PURE__ */(0, _factoriesNumber.createCompare)({
  config: _configReadonly.config,
  typed: typed
});
exports.compare = compare;
var compareText = /* #__PURE__ */(0, _factoriesNumber.createCompareText)({
  typed: typed
});
exports.compareText = compareText;
var cos = /* #__PURE__ */(0, _factoriesNumber.createCos)({
  typed: typed
});
exports.cos = cos;
var cot = /* #__PURE__ */(0, _factoriesNumber.createCot)({
  typed: typed
});
exports.cot = cot;
var csc = /* #__PURE__ */(0, _factoriesNumber.createCsc)({
  typed: typed
});
exports.csc = csc;
var cube = /* #__PURE__ */(0, _factoriesNumber.createCube)({
  typed: typed
});
exports.cube = cube;
var divide = /* #__PURE__ */(0, _factoriesNumber.createDivide)({
  typed: typed
});
exports.divide = divide;
var equalScalar = /* #__PURE__ */(0, _factoriesNumber.createEqualScalar)({
  config: _configReadonly.config,
  typed: typed
});
exports.equalScalar = equalScalar;
var erf = /* #__PURE__ */(0, _factoriesNumber.createErf)({
  typed: typed
});
exports.erf = erf;
var exp = /* #__PURE__ */(0, _factoriesNumber.createExp)({
  typed: typed
});
exports.exp = exp;
var filter = /* #__PURE__ */(0, _factoriesNumber.createFilter)({
  typed: typed
});
exports.filter = filter;
var fix = /* #__PURE__ */(0, _factoriesNumber.createFix)({
  typed: typed
});
exports.fix = fix;
var forEach = /* #__PURE__ */(0, _factoriesNumber.createForEach)({
  typed: typed
});
exports.forEach = forEach;
var format = /* #__PURE__ */(0, _factoriesNumber.createFormat)({
  typed: typed
});
exports.format = format;
var gamma = /* #__PURE__ */(0, _factoriesNumber.createGamma)({
  typed: typed
});
exports.gamma = gamma;
var isInteger = /* #__PURE__ */(0, _factoriesNumber.createIsInteger)({
  typed: typed
});
exports.isInteger = isInteger;
var isNegative = /* #__PURE__ */(0, _factoriesNumber.createIsNegative)({
  typed: typed
});
exports.isNegative = isNegative;
var isPositive = /* #__PURE__ */(0, _factoriesNumber.createIsPositive)({
  typed: typed
});
exports.isPositive = isPositive;
var isZero = /* #__PURE__ */(0, _factoriesNumber.createIsZero)({
  typed: typed
});
exports.isZero = isZero;
var LOG2E = /* #__PURE__ */(0, _factoriesNumber.createLOG2E)({
  config: _configReadonly.config
});
exports.LOG2E = LOG2E;
var largerEq = /* #__PURE__ */(0, _factoriesNumber.createLargerEq)({
  config: _configReadonly.config,
  typed: typed
});
exports.largerEq = largerEq;
var leftShift = /* #__PURE__ */(0, _factoriesNumber.createLeftShift)({
  typed: typed
});
exports.leftShift = leftShift;
var log10 = /* #__PURE__ */(0, _factoriesNumber.createLog10)({
  typed: typed
});
exports.log10 = log10;
var log2 = /* #__PURE__ */(0, _factoriesNumber.createLog2)({
  typed: typed
});
exports.log2 = log2;
var map = /* #__PURE__ */(0, _factoriesNumber.createMap)({
  typed: typed
});
exports.map = map;
var mean = /* #__PURE__ */(0, _factoriesNumber.createMean)({
  add: add,
  divide: divide,
  typed: typed
});
exports.mean = mean;
var mod = /* #__PURE__ */(0, _factoriesNumber.createMod)({
  typed: typed
});
exports.mod = mod;
var multiply = /* #__PURE__ */(0, _factoriesNumber.createMultiply)({
  typed: typed
});
exports.multiply = multiply;
var not = /* #__PURE__ */(0, _factoriesNumber.createNot)({
  typed: typed
});
exports.not = not;
var number = /* #__PURE__ */(0, _factoriesNumber.createNumber)({
  typed: typed
});
exports.number = number;
var or = /* #__PURE__ */(0, _factoriesNumber.createOr)({
  typed: typed
});
exports.or = or;
var pi = /* #__PURE__ */(0, _factoriesNumber.createPi)({
  config: _configReadonly.config
});
exports.pi = pi;
var pow = /* #__PURE__ */(0, _factoriesNumber.createPow)({
  typed: typed
});
exports.pow = pow;
var random = /* #__PURE__ */(0, _factoriesNumber.createRandom)({
  config: _configReadonly.config,
  typed: typed
});
exports.random = random;
var rightArithShift = /* #__PURE__ */(0, _factoriesNumber.createRightArithShift)({
  typed: typed
});
exports.rightArithShift = rightArithShift;
var round = /* #__PURE__ */(0, _factoriesNumber.createRound)({
  typed: typed
});
exports.round = round;
var sec = /* #__PURE__ */(0, _factoriesNumber.createSec)({
  typed: typed
});
exports.sec = sec;
var sign = /* #__PURE__ */(0, _factoriesNumber.createSign)({
  typed: typed
});
exports.sign = sign;
var sin = /* #__PURE__ */(0, _factoriesNumber.createSin)({
  typed: typed
});
exports.sin = sin;
var size = /* #__PURE__ */(0, _factoriesNumber.createSize)({
  matrix: matrix,
  config: _configReadonly.config,
  typed: typed
});
exports.size = size;
var smallerEq = /* #__PURE__ */(0, _factoriesNumber.createSmallerEq)({
  config: _configReadonly.config,
  typed: typed
});
exports.smallerEq = smallerEq;
var square = /* #__PURE__ */(0, _factoriesNumber.createSquare)({
  typed: typed
});
exports.square = square;
var string = /* #__PURE__ */(0, _factoriesNumber.createString)({
  typed: typed
});
exports.string = string;
var subtract = /* #__PURE__ */(0, _factoriesNumber.createSubtract)({
  typed: typed
});
exports.subtract = subtract;
var tanh = /* #__PURE__ */(0, _factoriesNumber.createTanh)({
  typed: typed
});
exports.tanh = tanh;
var typeOf = /* #__PURE__ */(0, _factoriesNumber.createTypeOf)({
  typed: typed
});
exports.typeOf = typeOf;
var unequal = /* #__PURE__ */(0, _factoriesNumber.createUnequal)({
  equalScalar: equalScalar,
  typed: typed
});
exports.unequal = unequal;
var xgcd = /* #__PURE__ */(0, _factoriesNumber.createXgcd)({
  typed: typed
});
exports.xgcd = xgcd;
var acoth = /* #__PURE__ */(0, _factoriesNumber.createAcoth)({
  typed: typed
});
exports.acoth = acoth;
var addScalar = /* #__PURE__ */(0, _factoriesNumber.createAddScalar)({
  typed: typed
});
exports.addScalar = addScalar;
var asech = /* #__PURE__ */(0, _factoriesNumber.createAsech)({
  typed: typed
});
exports.asech = asech;
var bitNot = /* #__PURE__ */(0, _factoriesNumber.createBitNot)({
  typed: typed
});
exports.bitNot = bitNot;
var ceil = /* #__PURE__ */(0, _factoriesNumber.createCeil)({
  typed: typed
});
exports.ceil = ceil;
var combinationsWithRep = /* #__PURE__ */(0, _factoriesNumber.createCombinationsWithRep)({
  typed: typed
});
exports.combinationsWithRep = combinationsWithRep;
var cosh = /* #__PURE__ */(0, _factoriesNumber.createCosh)({
  typed: typed
});
exports.cosh = cosh;
var csch = /* #__PURE__ */(0, _factoriesNumber.createCsch)({
  typed: typed
});
exports.csch = csch;
var divideScalar = /* #__PURE__ */(0, _factoriesNumber.createDivideScalar)({
  typed: typed
});
exports.divideScalar = divideScalar;
var equalText = /* #__PURE__ */(0, _factoriesNumber.createEqualText)({
  compareText: compareText,
  isZero: isZero,
  typed: typed
});
exports.equalText = equalText;
var expm1 = /* #__PURE__ */(0, _factoriesNumber.createExpm1)({
  typed: typed
});
exports.expm1 = expm1;
var isNumeric = /* #__PURE__ */(0, _factoriesNumber.createIsNumeric)({
  typed: typed
});
exports.isNumeric = isNumeric;
var LN2 = /* #__PURE__ */(0, _factoriesNumber.createLN2)({
  config: _configReadonly.config
});
exports.LN2 = LN2;
var lcm = /* #__PURE__ */(0, _factoriesNumber.createLcm)({
  typed: typed
});
exports.lcm = lcm;
var log1p = /* #__PURE__ */(0, _factoriesNumber.createLog1p)({
  typed: typed
});
exports.log1p = log1p;
var multiplyScalar = /* #__PURE__ */(0, _factoriesNumber.createMultiplyScalar)({
  typed: typed
});
exports.multiplyScalar = multiplyScalar;
var nthRoot = /* #__PURE__ */(0, _factoriesNumber.createNthRoot)({
  typed: typed
});
exports.nthRoot = nthRoot;
var pickRandom = /* #__PURE__ */(0, _factoriesNumber.createPickRandom)({
  config: _configReadonly.config,
  typed: typed
});
exports.pickRandom = pickRandom;
var randomInt = /* #__PURE__ */(0, _factoriesNumber.createRandomInt)({
  config: _configReadonly.config,
  typed: typed
});
exports.randomInt = randomInt;
var ResultSet = /* #__PURE__ */(0, _factoriesNumber.createResultSet)({});
exports.ResultSet = ResultSet;
var SQRT2 = /* #__PURE__ */(0, _factoriesNumber.createSQRT2)({
  config: _configReadonly.config
});
exports.SQRT2 = SQRT2;
var sinh = /* #__PURE__ */(0, _factoriesNumber.createSinh)({
  typed: typed
});
exports.sinh = sinh;
var sqrt = /* #__PURE__ */(0, _factoriesNumber.createSqrt)({
  typed: typed
});
exports.sqrt = sqrt;
var tan = /* #__PURE__ */(0, _factoriesNumber.createTan)({
  typed: typed
});
exports.tan = tan;
var unaryMinus = /* #__PURE__ */(0, _factoriesNumber.createUnaryMinus)({
  typed: typed
});
exports.unaryMinus = unaryMinus;
var acosh = /* #__PURE__ */(0, _factoriesNumber.createAcosh)({
  typed: typed
});
exports.acosh = acosh;
var apply = /* #__PURE__ */(0, _factoriesNumber.createApply)({
  isInteger: isInteger,
  typed: typed
});
exports.apply = apply;
var asinh = /* #__PURE__ */(0, _factoriesNumber.createAsinh)({
  typed: typed
});
exports.asinh = asinh;
var bitXor = /* #__PURE__ */(0, _factoriesNumber.createBitXor)({
  typed: typed
});
exports.bitXor = bitXor;
var catalan = /* #__PURE__ */(0, _factoriesNumber.createCatalan)({
  addScalar: addScalar,
  combinations: combinations,
  divideScalar: divideScalar,
  isInteger: isInteger,
  isNegative: isNegative,
  multiplyScalar: multiplyScalar,
  typed: typed
});
exports.catalan = catalan;
var compareNatural = /* #__PURE__ */(0, _factoriesNumber.createCompareNatural)({
  compare: compare,
  typed: typed
});
exports.compareNatural = compareNatural;
var equal = /* #__PURE__ */(0, _factoriesNumber.createEqual)({
  equalScalar: equalScalar,
  typed: typed
});
exports.equal = equal;
var factorial = /* #__PURE__ */(0, _factoriesNumber.createFactorial)({
  gamma: gamma,
  typed: typed
});
exports.factorial = factorial;
var hasNumericValue = /* #__PURE__ */(0, _factoriesNumber.createHasNumericValue)({
  isNumeric: isNumeric,
  typed: typed
});
exports.hasNumericValue = hasNumericValue;
var isNaN = /* #__PURE__ */(0, _factoriesNumber.createIsNaN)({
  typed: typed
});
exports.isNaN = isNaN;
var larger = /* #__PURE__ */(0, _factoriesNumber.createLarger)({
  config: _configReadonly.config,
  typed: typed
});
exports.larger = larger;
var mode = /* #__PURE__ */(0, _factoriesNumber.createMode)({
  isNaN: isNaN,
  isNumeric: isNumeric,
  typed: typed
});
exports.mode = mode;
var norm = /* #__PURE__ */(0, _factoriesNumber.createNorm)({
  typed: typed
});
exports.norm = norm;
var partitionSelect = /* #__PURE__ */(0, _factoriesNumber.createPartitionSelect)({
  compare: compare,
  isNaN: isNaN,
  isNumeric: isNumeric,
  typed: typed
});
exports.partitionSelect = partitionSelect;
var print = /* #__PURE__ */(0, _factoriesNumber.createPrint)({
  typed: typed
});
exports.print = print;
var quantileSeq = /* #__PURE__ */(0, _factoriesNumber.createQuantileSeq)({
  add: add,
  compare: compare,
  multiply: multiply,
  partitionSelect: partitionSelect,
  typed: typed
});
exports.quantileSeq = quantileSeq;
var rightLogShift = /* #__PURE__ */(0, _factoriesNumber.createRightLogShift)({
  typed: typed
});
exports.rightLogShift = rightLogShift;
var smaller = /* #__PURE__ */(0, _factoriesNumber.createSmaller)({
  config: _configReadonly.config,
  typed: typed
});
exports.smaller = smaller;
var stirlingS2 = /* #__PURE__ */(0, _factoriesNumber.createStirlingS2)({
  addScalar: addScalar,
  combinations: combinations,
  divideScalar: divideScalar,
  factorial: factorial,
  isInteger: isInteger,
  isNegative: isNegative,
  larger: larger,
  multiplyScalar: multiplyScalar,
  pow: pow,
  subtract: subtract,
  typed: typed
});
exports.stirlingS2 = stirlingS2;

var _true = /* #__PURE__ */(0, _factoriesNumber.createTrue)({});

exports._true = _true;
var variance = /* #__PURE__ */(0, _factoriesNumber.createVariance)({
  add: add,
  apply: apply,
  divide: divide,
  isNaN: isNaN,
  multiply: multiply,
  subtract: subtract,
  typed: typed
});
exports.variance = variance;
var acsch = /* #__PURE__ */(0, _factoriesNumber.createAcsch)({
  typed: typed
});
exports.acsch = acsch;
var atan2 = /* #__PURE__ */(0, _factoriesNumber.createAtan2)({
  typed: typed
});
exports.atan2 = atan2;
var composition = /* #__PURE__ */(0, _factoriesNumber.createComposition)({
  addScalar: addScalar,
  combinations: combinations,
  isInteger: isInteger,
  isNegative: isNegative,
  isPositive: isPositive,
  larger: larger,
  typed: typed
});
exports.composition = composition;
var deepEqual = /* #__PURE__ */(0, _factoriesNumber.createDeepEqual)({
  equal: equal,
  typed: typed
});
exports.deepEqual = deepEqual;
var floor = /* #__PURE__ */(0, _factoriesNumber.createFloor)({
  typed: typed
});
exports.floor = floor;
var hypot = /* #__PURE__ */(0, _factoriesNumber.createHypot)({
  abs: abs,
  addScalar: addScalar,
  divideScalar: divideScalar,
  isPositive: isPositive,
  multiplyScalar: multiplyScalar,
  smaller: smaller,
  sqrt: sqrt,
  typed: typed
});
exports.hypot = hypot;
var log = /* #__PURE__ */(0, _factoriesNumber.createLog)({
  typed: typed
});
exports.log = log;
var median = /* #__PURE__ */(0, _factoriesNumber.createMedian)({
  add: add,
  compare: compare,
  divide: divide,
  partitionSelect: partitionSelect,
  typed: typed
});
exports.median = median;
var multinomial = /* #__PURE__ */(0, _factoriesNumber.createMultinomial)({
  add: add,
  divide: divide,
  factorial: factorial,
  isInteger: isInteger,
  isPositive: isPositive,
  multiply: multiply,
  typed: typed
});
exports.multinomial = multinomial;
var permutations = /* #__PURE__ */(0, _factoriesNumber.createPermutations)({
  factorial: factorial,
  typed: typed
});
exports.permutations = permutations;
var range = /* #__PURE__ */(0, _factoriesNumber.createRange)({
  matrix: matrix,
  config: _configReadonly.config,
  larger: larger,
  largerEq: largerEq,
  smaller: smaller,
  smallerEq: smallerEq,
  typed: typed
});
exports.range = range;
var sech = /* #__PURE__ */(0, _factoriesNumber.createSech)({
  typed: typed
});
exports.sech = sech;
var std = /* #__PURE__ */(0, _factoriesNumber.createStd)({
  sqrt: sqrt,
  typed: typed,
  variance: variance
});
exports.std = std;
var clone = /* #__PURE__ */(0, _factoriesNumber.createClone)({
  typed: typed
});
exports.clone = clone;
var coth = /* #__PURE__ */(0, _factoriesNumber.createCoth)({
  typed: typed
});
exports.coth = coth;
var gcd = /* #__PURE__ */(0, _factoriesNumber.createGcd)({
  typed: typed
});
exports.gcd = gcd;
var isPrime = /* #__PURE__ */(0, _factoriesNumber.createIsPrime)({
  typed: typed
});
exports.isPrime = isPrime;
var numeric = /* #__PURE__ */(0, _factoriesNumber.createNumeric)({
  number: number
});
exports.numeric = numeric;
var prod = /* #__PURE__ */(0, _factoriesNumber.createProd)({
  config: _configReadonly.config,
  multiplyScalar: multiplyScalar,
  numeric: numeric,
  typed: typed
});
exports.prod = prod;
var bellNumbers = /* #__PURE__ */(0, _factoriesNumber.createBellNumbers)({
  addScalar: addScalar,
  isInteger: isInteger,
  isNegative: isNegative,
  stirlingS2: stirlingS2,
  typed: typed
});
exports.bellNumbers = bellNumbers;
var mad = /* #__PURE__ */(0, _factoriesNumber.createMad)({
  abs: abs,
  map: map,
  median: median,
  subtract: subtract,
  typed: typed
});
exports.mad = mad;
var sum = /* #__PURE__ */(0, _factoriesNumber.createSum)({
  add: add,
  config: _configReadonly.config,
  numeric: numeric,
  typed: typed
});
exports.sum = sum;
var max = /* #__PURE__ */(0, _factoriesNumber.createMax)({
  config: _configReadonly.config,
  larger: larger,
  numeric: numeric,
  typed: typed
});
exports.max = max;
var min = /* #__PURE__ */(0, _factoriesNumber.createMin)({
  config: _configReadonly.config,
  numeric: numeric,
  smaller: smaller,
  typed: typed
});
exports.min = min;