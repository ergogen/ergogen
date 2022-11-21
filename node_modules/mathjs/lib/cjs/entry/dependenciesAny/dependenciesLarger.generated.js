"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.largerDependencies = void 0;

var _dependenciesDenseMatrixClassGenerated = require("./dependenciesDenseMatrixClass.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var largerDependencies = {
  DenseMatrixDependencies: _dependenciesDenseMatrixClassGenerated.DenseMatrixDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  createLarger: _factoriesAny.createLarger
};
exports.largerDependencies = largerDependencies;