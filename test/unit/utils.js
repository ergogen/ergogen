const m = require('makerjs')
const u = require('../../src/utils')

describe('Utils', function() {

    it('deepcopy', function() {
        // basic deep copying
        u.deepcopy({arst: 'neio'}).should.deep.equal({arst: 'neio'})
        // undefined should be handled properly (would otherwise error out with "undefined")
        should.equal(u.deepcopy(), undefined)
    })

    it('deep', function() {
        const obj = {a: {b: {}}}
        // deep setting
        const res = u.deep(obj, 'a.b.c', 42)
        res.should.equal(obj)
        obj.a.b.c.should.equal(42)
        // deep access
        u.deep(obj, 'a.b.c').should.equal(42)
        // deep access on nonexistent keys should be undefined without error
        should.equal(u.deep(obj, 'non.existent.key'), undefined)
    })

    it('template', function() {
        u.template('arst').should.equal('arst')
        u.template('{arst}}').should.equal('{arst}}')
        u.template('{{arst}}').should.equal('')
        u.template('{{arst}}', {arst: 'neio'}).should.equal('neio')
        u.template('{{a}}_{{b}}', {a: 'c', b: 'd'}).should.equal('c_d')
        u.template(
            '{{longlonglong}}_{{short}}',
            {longlonglong: 'long', short: 'shortshortshort'}
        ).should.equal('long_shortshortshort')
        u.template('{{a.b.c}}', {a: {b: {c: 'deep'}}}).should.equal('deep')
        u.template('{x: {{number}}, y: {{number}}}', {number: 5}).should.equal('{x: 5, y: 5}')
    })

    it('eq', function() {
        // basic point usage
        u.eq([1, 2], [1, 2]).should.equal(true)
        u.eq([1, 2], [3, 4]).should.equal(false)
        // default params are empty arrays
        u.eq().should.equal(true)
    })

    it('line', function() {
        u.line([0, 0], [0, 1]).should.deep.equal({
            type: 'line',
            origin: [0, 0],
            end: [0, 1]
        })
    })

    it('circle', function() {
        u.circle([0, 0], 1).should.deep.equal({
            paths: {
                circle: {
                    type: 'circle',
                    origin: [0, 0],
                    radius: 1
                }
            }
        })
    })

    it('rect', function() {
        const expected = {
            bottom: {
                end: [0, 0],
                origin: [1, 0],
                type: 'line'
            },
            left: {
                end: [0, 1],
                origin: [0, 0],
                type: 'line'
            },
            right: {
                end: [1, 0],
                origin: [1, 1],
                type: 'line'
            },
            top: {
                end: [1, 1],
                origin: [0, 1],
                type: 'line'
            }
        }
        u.rect(1, 1).should.deep.equal({paths: expected, origin: [0, 0]})
        u.rect(1, 1, [2, 2]).should.deep.equal({paths: expected, origin: [2, 2]})
    })

    it('poly', function() {
        const expected = {
            paths: {
                p1: {
                    end: [0, 0],
                    origin: [1, 1],
                    type: 'line'
                },
                p2: {
                    end: [1, 0],
                    origin: [0, 0],
                    type: 'line'
                },
                p3: {
                    end: [1, 1],
                    origin: [1, 0],
                    type: 'line'
                }
            }
        }
        u.poly([[0, 0], [1, 0], [1, 1]]).should.deep.equal(expected)
        // consecutive duplications shouldn't matter
        u.poly([[0, 0], [1, 0], [1, 0], [1, 1]]).should.deep.equal(expected)
        // empty in, empty out
        u.poly([]).should.deep.equal({paths: {}})
    })

    it('poly', function() {
        u.bbox([[0, 0], [1, 0], [1, 1]]).should.deep.equal({
            high: [1, 1],
            low: [0, 0]
        })
    })

    it('combine helpers', function() {
        const a = u.rect(2, 2, [0, 0])
        const b = u.rect(2, 2, [1, 0])
        const farPoint = [1234.1234, 2143.56789]
        u.union(a, b).should.deep.equal(m.model.combine(a, b, false, true, false, true, {farPoint}))
        u.subtract(a, b).should.deep.equal(m.model.combine(a, b, false, true, true, false, {farPoint}))
        u.intersect(a, b).should.deep.equal(m.model.combine(a, b, true, false, true, false, {farPoint}))
        u.stack(a, b).should.deep.equal({
            models: {
                a, b
            }
        })
    })

    it('semver', function() {
        const expected = {major: 1, minor: 0, patch: 0}
        u.semver('1.0.0').should.deep.equal(expected)
        u.semver('1.0.0-develop').should.deep.equal(expected)
        u.semver('v1.0.0').should.deep.equal(expected)
        u.semver('1').should.deep.equal(expected)
        u.semver('1.0').should.deep.equal(expected)
        u.semver.bind(this, '1.', 'name').should.throw()
        u.semver.bind(this, 'invalid', 'name').should.throw()
    })

    it('satisfies', function() {
        u.satisfies('1.2.3', '1.2.3').should.be.true
        u.satisfies('1.2.3', '1.2.1').should.be.true
        u.satisfies('1.2.3', '1.1.0').should.be.true
        u.satisfies('1.2.3', '1.2.4').should.be.false
        u.satisfies('1.2.3', '1.3.0').should.be.false
        u.satisfies('1.2.3', '2.0.0').should.be.false
        u.satisfies({major: 1, minor: 2, patch: 3}, {major: 1, minor: 2, patch: 3}).should.be.true
    })

})