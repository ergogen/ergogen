var typed = require('../typed-function');

// create a typed function that invokes itself
var sqrt = typed({
  'number': function (value) {
    return Math.sqrt(value);
  },
  'string': function (value) {
    return this(parseInt(value, 10));
  }
});

// use the typed function
console.log(sqrt("9"));         // output: 3
