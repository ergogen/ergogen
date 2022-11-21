"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixDependencies = void 0;

var _dependenciesComplexClassGenerated = require("./dependenciesComplexClass.generated.js");

var _dependenciesCeilGenerated = require("./dependenciesCeil.generated.js");

var _dependenciesFloorGenerated = require("./dependenciesFloor.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var fixDependencies = {
  ComplexDependencies: _dependenciesComplexClassGenerated.ComplexDependencies,
  ceilDependencies: _dependenciesCeilGenerated.ceilDependencies,
  floorDependencies: _dependenciesFloorGenerated.floorDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  createFix: _factoriesAny.createFix
};
exports.fixDependencies = fixDependencies;