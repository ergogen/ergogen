"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typedDocs = void 0;
var typedDocs = {
  name: 'typed',
  category: 'Core',
  syntax: ['typed(signatures)', 'typed(name, signatures)'],
  description: 'Create a typed function.',
  examples: ['double = typed({ "number, number": f(x)=x+x })', 'double(2)', 'double("hello")'],
  seealso: []
};
exports.typedDocs = typedDocs;