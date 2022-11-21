//
// typed-function benchmark
//
// WARNING: be careful, these are micro-benchmarks, which can only be used
//          to get an indication of the performance. Real performance and
//          bottlenecks should be assessed in real world applications,
//          not in micro-benchmarks.
//
// Before running, make sure you've installed the needed packages which
// are defined in the devDependencies of the project.
//
// To create a bundle:
//
//     browserify -o benchmark/benchmark.bundle.js benchmark/benchmark.js
//

'use strict';

var assert = require('assert');
var Benchmark = require('benchmark');
var padRight = require('pad-right');
var typed = require('../typed-function');

// expose on window when using bundled in a browser
if (typeof window !== 'undefined') {
  window['Benchmark'] = Benchmark;
}

function add(x, y) {
  return x + y;
}

var signatures = {
  'number, number': add,
  'boolean, boolean': add,
  'Date, Date': add,
  'string, string': add
};

var addTyped = typed('add', signatures);

assert(add(2,3), 5);
assert(addTyped(2,3), 5);
assert(addTyped('hello', 'world'), 'helloworld');
assert.throws(function () { addTyped(1) }, /TypeError/)
assert.throws(function () { addTyped(1,2,3) }, /TypeError/)

var result = 0;
var suite = new Benchmark.Suite();
suite
    .add(pad('typed add'), function() {
      result += addTyped(result, 4);
      result += addTyped(String(result), 'world').length;
    })
    .add(pad('native add'), function() {
      result += add(result, 4);
      result += add(String(result), 'world').length;
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      if (result > Infinity) {
        console.log()
      }
    })
    .run();

function pad (text) {
  return padRight(text, 20, ' ');
}
