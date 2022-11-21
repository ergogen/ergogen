"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orDependencies = void 0;

var _dependenciesDenseMatrixClassGenerated = require("./dependenciesDenseMatrixClass.generated.js");

var _dependenciesEqualScalarGenerated = require("./dependenciesEqualScalar.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var orDependencies = {
  DenseMatrixDependencies: _dependenciesDenseMatrixClassGenerated.DenseMatrixDependencies,
  equalScalarDependencies: _dependenciesEqualScalarGenerated.equalScalarDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  createOr: _factoriesAny.createOr
};
exports.orDependencies = orDependencies;