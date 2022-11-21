var typed = require('../typed-function');

// create a typed function
var fn1 = typed({
  'number, string': function (a, b) {
    return 'a is a number, b is a string';
  }
});

// create a typed function with multiple types per argument (type union)
var fn2 = typed({
  'string, number | boolean': function (a, b) {
    return 'a is a string, b is a number or a boolean';
  }
});

// create a typed function with any type argument
var fn3 = typed({
  'string, any': function (a, b) {
    return 'a is a string, b can be anything';
  }
});

// create a typed function with multiple signatures
var fn4 = typed({
  'number': function (a) {
    return 'a is a number';
  },
  'number, boolean': function (a, b) {
    return 'a is a number, b is a boolean';
  },
  'number, number': function (a, b) {
    return 'a is a number, b is a number';
  }
});

// create a typed function from a plain function with signature
function fnPlain(a, b) {
  return 'a is a number, b is a string';
}
fnPlain.signature = 'number, string';
var fn5 = typed(fnPlain);

// use the functions
console.log(fn1(2, 'foo'));      // outputs 'a is a number, b is a string'
console.log(fn4(2));             // outputs 'a is a number'

// calling the function with a non-supported type signature will throw an error
try {
  fn2('hello', 'world');
}
catch (err) {
  console.log(err.toString());
  // outputs:  TypeError: Unexpected type of argument.
  //           Expected: number or boolean, actual: string, index: 1.
}
