const p = require('../../src/prepare')

describe('Prepare', function() {
    it('unnest', function() {
        p.unnest({'a.b.c': 1}).should.deep.equal({a: {b: {c: 1}}})
        p.unnest({'a.b.c': {
            d: 2,
            'e.f': 3
        }}).should.deep.equal({a: {b: {c: {d: 2, e: {f: 3}}}}})
        p.unnest({'root': [{
            'a.b': 1
        }]}).should.deep.equal({root: [{a: {b: 1}}]})
    })

    it('extend', function() {
        p.extend('something', undefined).should.equal('something')
        should.equal(p.extend('something', '$unset'), undefined)
        p.extend(undefined, 'something').should.equal('something')
        p.extend(28, 'something').should.equal('something')
        p.extend('something', 28).should.equal(28)
        p.extend(27, 28).should.equal(28)
        p.extend({a: 1, c: 1, d: 1}, {b: 2, c: 2, d: '$unset'}).should.deep.equal({a: 1, b: 2, c: 2})
        p.extend([3, 2, 1], [null, 4, 5]).should.deep.equal([3, 4, 5])
    })

    it('inherit', function() {
        // normal case
        p.inherit({
            a: {
                x: 1,
                y: 2
            },
            b: {
                $extends: 'a',
                z: 3
            },
            c: {
                $extends: ['b'],
                w: 4
            }
        }).c.should.deep.equal({
            x: 1,
            y: 2,
            z: 3,
            w: 4
        })
        // should apply to objects within arrays as well!
        p.inherit({
            a: {
                x: 1,
                y: 2
            },
            b: [
                {
                    $extends: 'a',
                    z: 3
                }
            ]
        }).b[0].should.deep.equal({
            x: 1,
            y: 2,
            z: 3
        })
    })

    it('parameterize', function() {
        p.parameterize(1).should.equal(1)

        p.parameterize({
            unused: {
                $params: ['PAR']
            },
            skip: {
                $skip: true
            }
        }).should.deep.equal({})

        p.parameterize({
            decl: {
                a: 'PAR',
                $params: ['PAR'],
                $args: [1]
            }
        }).decl.should.deep.equal({
            a: '1'
        })

        p.parameterize({
            decl: {
                normal_use: 'PAR1',
                sub: {
                    nested_use: 'PAR2 * 2'
                },
                $params: ['PAR1', 'PAR2'],
                $args: ['text', 14]
            }
        }).decl.should.deep.equal({
            normal_use: 'text',
            sub: {
                nested_use: '14 * 2',
            }
        })

        p.parameterize.bind(this, {
            decl: {
                $args: [1]
            }
        }).should.throw('missing')

        p.parameterize.bind(this, {
            decl: {
                $params: ['PAR1', 'PAR2'],
                $args: [1]
            }
        }).should.throw('match')

        p.parameterize.bind(this, {
            decl: {
                a: 'PAR',
                $params: ['PAR'],
                $args: ['in"jection']
            }
        }).should.throw('valid')
    })
})