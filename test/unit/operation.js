const o = require('../../src/operation')

describe('Operation', function() {

    it('op_prefix', function() {
        o.op_prefix('arst').should.deep.equal({name: 'arst', operation: 'add'})
        o.op_prefix('+arst').should.deep.equal({name: 'arst', operation: 'add'})
        o.op_prefix('-arst').should.deep.equal({name: 'arst', operation: 'subtract'})
        o.op_prefix('~arst').should.deep.equal({name: 'arst', operation: 'intersect'})
        o.op_prefix('^arst').should.deep.equal({name: 'arst', operation: 'stack'})
    })

    it('operation', function() {
        // without choices, it's the same as op_prefix
        o.operation('arst').should.deep.equal({name: 'arst', operation: 'add'})
        // with choices, it propagates the "what" from where it found the name
        o.operation('arst', {bad: [], good: ['arst']}).should.deep.equal({name: 'arst', operation: 'add', what: 'good'})
        // it also respects order when overridden
        o.operation('arst', {first: ['arst'], second: ['arst']}, ['second', 'first']).should.deep.equal({name: 'arst', operation: 'add', what: 'second'})
    })

})