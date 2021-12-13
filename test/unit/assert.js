const a = require('../../src/assert')

describe('Assert', function() {

    it('mathnum', function() {
        a.mathnum('1')().should.equal(1)
        a.mathnum('1 + 2')().should.equal(3)
        a.mathnum('nope').should.throw('symbol')
    })
    
    it('assert', function() {
        a.assert.bind(this, false, 'msg').should.throw('msg')
        a.assert.bind(this, true, 'msg').should.not.throw('msg')
    })

    it('type', function() {
        // a more complete `typeof` operator
        a.type(undefined)().should.equal('undefined')
        a.type(null)().should.equal('null')
        a.type(false)().should.equal('boolean')
        a.type(0)().should.equal('number')
        a.type(3.14)().should.equal('number')
        a.type('arst')().should.equal('string')
        a.type('1 + 2')().should.equal('number') // formulas are also numbers here!
        a.type('arst')({arst: 2}).should.equal('number') // and variables count, too!
        a.type([])().should.equal('array')
        a.type({})().should.equal('object')
    })

    it('sane', function() {
        a.sane('arst', 'name', 'string')().should.equal('arst')
        a.sane('arst', 'name', 'number').should.throw('name')
        a.sane('arst', 'name', 'number')({arst: 2}).should.equal(2)
    })

    it('unexpected', function() {
        const good_keys = ['good']
        a.unexpected.bind(this, [], 'name', good_keys).should.throw('object')
        a.unexpected.bind(this, {}, 'name', good_keys).should.not.throw()
        a.unexpected.bind(this, {good: true}, 'name', good_keys).should.not.throw()
        a.unexpected.bind(this, {good: true, bad: true}, 'name', good_keys).should.throw('bad')
    })

    it('in', function() {
        a.in('match', 'name', ['match']).should.equal('match')
        a.in.bind(this, 'not.a.match', 'name', ['match']).should.throw('name')
    })

    it('arr', function() {
        // non-arrays are bad
        a.arr('val', 'name', 0, 'string', '').should.throw('array')
        // arrays are good
        a.arr(['val'], 'name', 0, 'string', '')().should.deep.equal(['val'])
        // length check works
        a.arr(['val'], 'name', 2, 'string', '').should.throw('length')
        // defaults get filled
        a.arr([undefined, 'val'], 'name', 2, 'string', 'def')().should.deep.equal(['def', 'val'])
        // mathnums are supported
        a.arr(['1 + 2'], 'name', 0, 'number', '')().should.deep.equal([3])

        // arr derivatives
        a.strarr(['val'], 'name').should.deep.equal(a.arr(['val'], 'name', 0, 'string', '')())
        a.numarr([1], 'name', 1)().should.deep.equal(a.arr([1], 'name', 1, 'number', 0)())
        a.xy([1, 2], 'name')().should.deep.equal(a.arr([1, 2], 'name', 2, 'number', 0)())

        // wh adds array expansion
        a.wh([1, 2], 'name')().should.deep.equal(a.arr([1, 2], 'name', 2, 'number', 0)())
        a.wh(1, 'name')().should.deep.equal(a.arr([1, 1], 'name', 2, 'number', 0)())
        
        // trbl adds 1->4 and 2->4 array expansions
        a.trbl([1, 2, 3, 4], 'name')().should.deep.equal(a.arr([1, 2, 3, 4], 'name', 4, 'number', 0)())
        a.trbl(1, 'name')().should.deep.equal(a.arr([1, 1, 1, 1], 'name', 4, 'number', 0)())
        // the 2->4 is "inverted", because 2 number usually mean x,y, so the first is the horizontal
        // while for 4, it start with top, which is vertical
        a.trbl([1, 2], 'name')().should.deep.equal(a.arr([2, 1, 2, 1], 'name', 4, 'number', 0)())
    })
})