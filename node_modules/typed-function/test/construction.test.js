// test parse
var assert = require('assert');
var typed = require('../typed-function');

describe('construction', function() {

  it('should throw an error when not providing any signatures', function() {
    assert.throws(function () {
      typed({});
    }, /Error: No signatures provided/);
  });

  it('should create a named function', function() {
    var fn = typed('myFunction',  {
      'string': function (str) {
        return 'foo';
      }
    });

    assert.equal(fn('bar'), 'foo');
    assert.equal(fn.name, 'myFunction');
  });

  it('should create a typed function from a regular function with a signature', function() {
    function myFunction(str) {
      return 'foo';
    }
    myFunction.signature = 'string'

    var fn = typed(myFunction);

    assert.equal(fn('bar'), 'foo');
    assert.equal(fn.name, 'myFunction');
    assert.deepEqual(Object.keys(fn.signatures), ['string']);
  });

  it('should create an unnamed function', function() {
    var fn = typed({
      'string': function (str) {
        return 'foo';
      }
    });

    assert.equal(fn('bar'), 'foo');
    assert.equal(fn.name, '');
  });

  it('should inherit the name of typed functions', function() {
    var fn = typed({
      'string': typed('fn1', {
        'string': function (str) {
          return 'foo';
        }
      })
    });

    assert.equal(fn('bar'), 'foo');
    assert.equal(fn.name, 'fn1');
  });

  it('should not inherit the name of the JavaScript functions (only from typed functions)', function() {
    var fn = typed({
      'string': function fn1 (str) {
        return 'foo';
      }
    });

    assert.equal(fn('bar'), 'foo');
    assert.equal(fn.name, '');
  });

  it('should compose a function with zero arguments', function() {
    var signatures = {
      '': function () {
        return 'noargs';
      }
    };
    var fn = typed(signatures);

    assert.equal(fn(), 'noargs');
    assert(fn.signatures instanceof Object);
    assert.strictEqual(Object.keys(fn.signatures).length, 1);
    assert.strictEqual(fn.signatures[''], signatures['']);
  });

  it('should create a typed function with one argument', function() {
    var fn = typed({
      'string': function () {
        return 'string';
      }
    });

    assert.equal(fn('hi'), 'string');
  });

  it('should create a typed function with two arguments', function() {
    var fn = typed({
      'string, boolean': function () {
        return 'foo';
      }
    });

    assert.equal(fn('hi', true), 'foo');
  });

  it('should create a named, typed function', function() {
    var fn = typed('myFunction', {
      'string, boolean': function () {
        return 'noargs';
      }
    });

    assert.equal(fn('hi', true), 'noargs');
    assert.equal(fn.name, 'myFunction');
  });

  it('should correctly recognize Date from Object (both are an Object)', function() {
    var signatures = {
      'Object': function (value) {
        assert(value instanceof Object);
        return 'Object';
      },
      'Date': function (value) {
        assert(value instanceof Date);
        return 'Date';
      }
    };
    var fn = typed(signatures);

    assert.equal(fn({foo: 'bar'}), 'Object');
    assert.equal(fn(new Date()), 'Date');
  });

  it('should correctly handle null', function () {
    var fn = typed({
      'Object': function (a) {
        return 'Object';
      },
      'null': function (a) {
        return 'null';
      },
      'undefined': function (a) {
        return 'undefined';
      }
    });

    assert.equal(fn(new Object(null)), 'Object');
    assert.equal(fn(null), 'null');
    assert.equal(fn(undefined), 'undefined');
  });

  it('should throw correct error message when passing null from an Object', function() {
    var signatures = {
      'Object': function (value) {
        assert(value instanceof Object);
        return 'Object';
      }
    };
    var fn = typed(signatures);

    assert.equal(fn({}), 'Object');
    assert.throws(function () { fn(null) },
        /TypeError: Unexpected type of argument in function unnamed \(expected: Object, actual: null, index: 0\)/);
  });

  it('should create a new, isolated instance of typed-function', function() {
    var typed1 = typed.create();
    var typed2 = typed.create();
    function Person() {}

    typed1.types.push({
      name: 'Person',
      test: function (x) {
        return x instanceof Person;
      }
    });

    assert.strictEqual(typed.create, typed1.create);
    assert.notStrictEqual(typed.types, typed1.types);
    assert.notStrictEqual(typed.conversions, typed1.conversions);

    assert.strictEqual(typed.create, typed2.create);
    assert.notStrictEqual(typed.types, typed2.types);
    assert.notStrictEqual(typed.conversions, typed2.conversions);

    assert.strictEqual(typed1.create, typed2.create);
    assert.notStrictEqual(typed1.types, typed2.types);
    assert.notStrictEqual(typed1.conversions, typed2.conversions);

    typed1({
      'Person': function (p) {return 'Person'}
    });

    assert.throws(function () {
      typed2({
        'Person': function (p) {return 'Person'}
      });
    }, /Error: Unknown type "Person"/)
  });

  it('should add a type using addType (before object)', function() {
    var typed2 = typed.create();
    function Person() {}

    var newType = {
      name: 'Person',
      test: function (x) {
        return x instanceof Person;
      }
    };

    var objectEntry = typed2.types.find(function (entry) {
      return entry.name === 'Object';
    });
    var objectIndex = typed2.types.indexOf(objectEntry);

    typed2.addType(newType);

    assert.strictEqual(typed2.types[objectIndex], newType);
  });

  it('should add a type using addType at the end (after Object)', function() {
    var typed2 = typed.create();
    function Person() {}

    var newType = {
      name: 'Person',
      test: function (x) {
        return x instanceof Person;
      }
    };

    typed2.addType(newType, false);

    assert.strictEqual(typed2.types[typed2.types.length - 1], newType);
  });

  it('should throw an error when passing an invalid type to addType', function() {
    var typed2 = typed.create();
    var errMsg = /TypeError: Object with properties {name: string, test: function} expected/;

    assert.throws(function () {typed2.addType({})}, errMsg);
    assert.throws(function () {typed2.addType({name: 2, test: function () {}})}, errMsg);
    assert.throws(function () {typed2.addType({name: 'foo', test: 'bar'})}, errMsg);
  });

  it('should throw an error when providing an unsupported type of argument', function() {
    var fn = typed('fn1', {
      'number': function (value) {
        return 'number:' + value;
      }
    });

    assert.throws(function () {fn(new Date())}, /TypeError: Unexpected type of argument in function fn1 \(expected: number, actual: Date, index: 0\)/);
  });

  it('should throw an error when providing a wrong function signature', function() {
    var fn = typed('fn1', {
      'number': function (value) {
        return 'number:' + value;
      }
    });

    assert.throws(function () {fn(1, 2)}, /TypeError: Too many arguments in function fn1 \(expected: 1, actual: 2\)/);
  });

  it('should throw an error when composing with an unknown type', function() {
    assert.throws(function () {
      var fn = typed({
        'foo': function (value) {
          return 'number:' + value;
        }
      });
    }, /Error: Unknown type "foo"/);
  });

  it('should ignore types from typed.ignore', function() {
    var typed2 = typed.create();
    typed2.ignore = ['string'];

    var fn = typed2({
      'number': function () {},
      'number, number': function () {},

      'string, number': function () {},
      'number, string': function () {},
      'boolean | string, boolean': function () {},
      'any, ...string': function () {},
      'string': function () {}
    });

    assert.deepEqual(Object.keys(fn.signatures).sort(), ['boolean,boolean', 'number', 'number,number']);
  });

  it('should give a hint when composing with a wrongly cased type', function() {
    assert.throws(function () {
      var fn = typed({
        'array': function (value) {
          return 'array:' + value;
        }
      });
    }, /Error: Unknown type "array". Did you mean "Array"?/);

    assert.throws(function () {
      var fn = typed({
        'function': function (value) {
          return 'Function:' + value;
        }
      });
    }, /Error: Unknown type "function". Did you mean "Function"?/);
  });

  it('should attach signatures to the created typed-function', function() {
    var fn1 = function () {}
    var fn2 = function () {}
    var fn3 = function () {}
    var fn4 = function () {}

    var fn = typed({
      'string': fn1,
      'string, boolean': fn2,
      'number | Date, boolean': fn3,
      'Array | Object, string | RegExp': fn3,
      'number, ...string | number': fn4
    });

    assert.deepStrictEqual(fn.signatures, {
      'string': fn1,
      'string,boolean': fn2,
      'number,boolean': fn3,
      'Date,boolean': fn3,
      'Array,string': fn3,
      'Array,RegExp': fn3,
      'Object,string': fn3,
      'Object,RegExp': fn3,
      'number,...string|number': fn4
    });
  });

  it('should correctly order signatures', function () {
    var fn = typed({
      'boolean': function (a) {
        return 'boolean';
      },
      'string': function (a) {
        return 'string';
      },
      'number': function (a) {
        return 'number';
      }
    });

    // TODO: this is tricky, object keys do not officially have a guaranteed order
    assert.deepEqual(Object.keys(fn.signatures),
        ['number', 'string', 'boolean']);
  });

  it('should allow a function to be defined recursively', function () {
    var fn = typed({
      'number': function (value) {
        return 'number:' + value;
      },
      'string': function (value) {
        return this(parseInt(value, 10));
      }
    });

    assert.equal(fn('2'), 'number:2');
  })

});
