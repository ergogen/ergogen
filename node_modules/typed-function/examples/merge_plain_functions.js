var typed = require('../typed-function');

// create a couple of plain functions with a signature
function fn1 (a) {
  return a + a;
}
fn1.signature = 'number';

function fn2 (a) {
  var value = +a;
  return value + value;
}
fn2.signature = 'string';

// merge multiple typed functions
var fn3 = typed('fn3', fn1, fn2);

// use merged function
console.log(fn3(2));    // outputs 4
console.log(fn3('3'));  // outputs 6
