"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detDependencies = void 0;

var _dependenciesLupGenerated = require("./dependenciesLup.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesMultiplyGenerated = require("./dependenciesMultiply.generated.js");

var _dependenciesSubtractGenerated = require("./dependenciesSubtract.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _dependenciesUnaryMinusGenerated = require("./dependenciesUnaryMinus.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var detDependencies = {
  lupDependencies: _dependenciesLupGenerated.lupDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  multiplyDependencies: _dependenciesMultiplyGenerated.multiplyDependencies,
  subtractDependencies: _dependenciesSubtractGenerated.subtractDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  unaryMinusDependencies: _dependenciesUnaryMinusGenerated.unaryMinusDependencies,
  createDet: _factoriesAny.createDet
};
exports.detDependencies = detDependencies;