"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combinationsNumber = combinationsNumber;

var _number = require("../../utils/number.js");

var _product = require("../../utils/product.js");

function combinationsNumber(n, k) {
  if (!(0, _number.isInteger)(n) || n < 0) {
    throw new TypeError('Positive integer value expected in function combinations');
  }

  if (!(0, _number.isInteger)(k) || k < 0) {
    throw new TypeError('Positive integer value expected in function combinations');
  }

  if (k > n) {
    throw new TypeError('k must be less than or equal to n');
  }

  var nMinusk = n - k;
  var prodrange;

  if (k < nMinusk) {
    prodrange = (0, _product.product)(nMinusk + 1, n);
    return prodrange / (0, _product.product)(1, k);
  }

  prodrange = (0, _product.product)(k + 1, n);
  return prodrange / (0, _product.product)(1, nMinusk);
}

combinationsNumber.signature = 'number, number';