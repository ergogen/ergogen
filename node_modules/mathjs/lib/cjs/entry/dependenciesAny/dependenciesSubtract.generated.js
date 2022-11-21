"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subtractDependencies = void 0;

var _dependenciesDenseMatrixClassGenerated = require("./dependenciesDenseMatrixClass.generated.js");

var _dependenciesAddScalarGenerated = require("./dependenciesAddScalar.generated.js");

var _dependenciesEqualScalarGenerated = require("./dependenciesEqualScalar.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _dependenciesUnaryMinusGenerated = require("./dependenciesUnaryMinus.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var subtractDependencies = {
  DenseMatrixDependencies: _dependenciesDenseMatrixClassGenerated.DenseMatrixDependencies,
  addScalarDependencies: _dependenciesAddScalarGenerated.addScalarDependencies,
  equalScalarDependencies: _dependenciesEqualScalarGenerated.equalScalarDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  unaryMinusDependencies: _dependenciesUnaryMinusGenerated.unaryMinusDependencies,
  createSubtract: _factoriesAny.createSubtract
};
exports.subtractDependencies = subtractDependencies;