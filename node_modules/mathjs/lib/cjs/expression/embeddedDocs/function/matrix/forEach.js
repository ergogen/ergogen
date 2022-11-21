"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEachDocs = void 0;
var forEachDocs = {
  name: 'forEach',
  category: 'Matrix',
  syntax: ['forEach(x, callback)'],
  description: 'Iterates over all elements of a matrix/array, and executes the given callback function.',
  examples: ['forEach([1, 2, 3], function(val) { console.log(val) })'],
  seealso: ['map', 'sort', 'filter']
};
exports.forEachDocs = forEachDocs;