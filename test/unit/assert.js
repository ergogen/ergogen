const a = require('../../src/assert')
const mathjs = require('mathjs')

describe('Assert', function() {

    it('mathnum', function() {
        a.mathnum('1')().should.equal(1)
        a.mathnum('1 + 2')().should.equal(3)
        a.mathnum('nope').should.throw('symbol')
    })

    it('triangle_sss', function() {
        // the angle opposite the first side
        a.mathnum('triangle_sss(3, 4, 5)')().should.be.closeTo(36.86989764584401, 1e-12)
        a.mathnum('triangle_sss(5, 3, 4)')().should.be.closeTo(90, 1e-12)
        // units, and assignment back into the units
        const thumb = {pitch: 21, radius: 80}
        a.mathnum('step = triangle_sss(pitch, radius, radius)')(thumb).should.be.closeTo(15.083661995592024, 1e-12)
        thumb.step.should.be.closeTo(15.083661995592024, 1e-12)
        // the scale of the triangle doesn't matter
        a.mathnum('triangle_sss(1.5e-162, 1.5e-162, 1.5e-162)')().should.be.closeTo(60, 1e-12)
        a.mathnum('triangle_sss(1e200, 1e200, 1e200)')().should.be.closeTo(60, 1e-12)
        // argument count
        a.mathnum('triangle_sss(3, 4)').should.throw('Function "triangle_sss" expects 3 arguments, got 2!')
        a.mathnum('triangle_sss(3, 4, 5, 6)').should.throw('expects 3 arguments, got 4')
        // arguments have to be positive finite numbers
        for (const arg of ['"3"', '3 cm', '3i', '[3]', 'true', 'NaN', 'Infinity', '0', '-3']) {
            a.mathnum(`triangle_sss(${arg}, 4, 5)`).should.throw('Argument "opposite_side" of "triangle_sss" must be a positive finite number!')
        }
        a.mathnum('triangle_sss(3, 0, 5)').should.throw('Argument "side"')
        a.mathnum('triangle_sss(3, 4, 0)').should.throw('Argument "other_side"')
        // the triangle inequality is strict, for all three sides
        a.mathnum('triangle_sss(3, 1, 1)').should.throw('Sides in "triangle_sss" must form a numerically resolvable non-degenerate triangle!')
        a.mathnum('triangle_sss(1, 3, 1)').should.throw('non-degenerate')
        a.mathnum('triangle_sss(1, 1, 2)').should.throw('non-degenerate')
        a.mathnum('triangle_sss(0.5, 0.1, 0.4)').should.throw('non-degenerate')
        // triangles too thin to resolve an angle for
        a.mathnum('triangle_sss(1e-8, 1, 1)').should.throw('non-degenerate')
    })

    it('triangle_asa', function() {
        // the length opposite the first angle, with the side between the angles
        a.mathnum('triangle_asa(30, 10, 60)')().should.be.closeTo(5, 1e-12)
        a.mathnum('triangle_asa(60, 10, 30)')().should.be.closeTo(8.660254037844386, 1e-12)
        // units and nesting, inverting the solvers on a 3-4-5 triangle and a thumb fan
        a.mathnum('triangle_asa(triangle_sss(a, b, c), b, 90)')({a: 3, b: 4, c: 5}).should.be.closeTo(3, 1e-12)
        a.mathnum('triangle_asa((180 - step) / 2, pitch, (180 - step) / 2)')({pitch: 21, step: 15.083661995592024}).should.be.closeTo(80, 1e-12)
        // argument count
        a.mathnum('triangle_asa()').should.throw('Function "triangle_asa" expects 3 arguments, got 0!')
        a.mathnum('triangle_asa(30, 10, 60, 1)').should.throw('expects 3 arguments, got 4')
        // arguments have to be positive finite numbers
        a.mathnum('triangle_asa(-30, 10, 60)').should.throw('Argument "opposite_angle" of "triangle_asa" must be a positive finite number!')
        a.mathnum('triangle_asa(30, -10, 60)').should.throw('Argument "side"')
        a.mathnum('triangle_asa(30, 10, NaN)').should.throw('Argument "other_angle"')
        // angles have to leave room for a third one
        a.mathnum('triangle_asa(90, 10, 90)').should.throw('Angles in "triangle_asa" must form a numerically resolvable triangle with a sum below 180 degrees!')
        a.mathnum('triangle_asa(100, 10, 90)').should.throw('sum below 180 degrees')
        a.mathnum('triangle_asa(1e-14, 10, 1e-14)').should.throw('sum below 180 degrees')
        // results that over- or underflow
        a.mathnum('triangle_asa(90, 1e308, 89)').should.throw('Result of "triangle_asa" must be a positive finite number!')
        a.mathnum('triangle_asa(1, 5e-324, 1)').should.throw('Result of "triangle_asa"')
    })

    it('solver scope', function() {
        // regular math is unchanged
        a.mathnum('sin(pi / 2) + 1')().should.equal(2)
        // units shadow the solvers, just like any other function
        a.mathnum('triangle_sss')({triangle_sss: 2}).should.equal(2)
        // a bare solver name is not a number
        a.type('triangle_sss')().should.equal('string')
        // the solvers don't leak into the global mathjs instance
        mathjs.evaluate.bind(this, 'triangle_sss(3, 4, 5)').should.throw('Undefined function triangle_sss')
        // field validation keeps its generic error
        a.sane('triangle_sss(1, 2, 3)', 'name', 'number').should.throw('Field "name" should be of type number!')
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