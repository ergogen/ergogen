"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floorDependencies = void 0;

var _dependenciesEqualScalarGenerated = require("./dependenciesEqualScalar.generated.js");

var _dependenciesMatrixGenerated = require("./dependenciesMatrix.generated.js");

var _dependenciesRoundGenerated = require("./dependenciesRound.generated.js");

var _dependenciesTypedGenerated = require("./dependenciesTyped.generated.js");

var _factoriesAny = require("../../factoriesAny.js");

/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
var floorDependencies = {
  equalScalarDependencies: _dependenciesEqualScalarGenerated.equalScalarDependencies,
  matrixDependencies: _dependenciesMatrixGenerated.matrixDependencies,
  roundDependencies: _dependenciesRoundGenerated.roundDependencies,
  typedDependencies: _dependenciesTypedGenerated.typedDependencies,
  createFloor: _factoriesAny.createFloor
};
exports.floorDependencies = floorDependencies;