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
        // should be able to detect circular dependencies and error out
        p.inherit.bind(this, {
            a: {
                $extends: 'a'
            }
        }).should.throw('circular dependency')

        // Issue #100: Order of extends
        const config100 = {
            A: { prop: 'A' },
            B: { prop: 'B' },
            C: { $extends: ['A', 'B'] }
        }
        p.inherit(config100).C.prop.should.equal('B')

        // Issue #97: Recursive extends (chained)
        const config97a = {
            A: { propA: 'A' },
            B: { $extends: 'A', propB: 'B' },
            C: { $extends: 'B', propC: 'C' }
        }
        p.inherit(config97a).C.should.deep.equal({
            propA: 'A',
            propB: 'B',
            propC: 'C'
        })

        // Issue #97: Nested recursive extends
        const config97b = {
            templates: {
                base: { size: 18 },
                parent: {
                    child: { $extends: 'templates.base', color: 'blue' }
                }
            },
            main: { $extends: 'templates.parent' }
        }
        p.inherit(config97b).main.child.should.deep.equal({
            size: 18,
            color: 'blue'
        })

        // Complex multi-level recursive inheritance
        const config_complex = {
            A: { a: 1 },
            B: { $extends: 'A', b: 2 },
            C: { $extends: ['A', 'B'], c: 3 },
            D: {
                sub: { $extends: 'C', d: 4 }
            },
            E: { $extends: 'D', e: 5 }
        }
        p.inherit(config_complex).E.should.deep.equal({
            sub: {
                a: 1,
                b: 2,
                c: 3,
                d: 4
            },
            e: 5
        })

        // Multiple inheritance with overlapping properties
        const config_overlap = {
            A: { common: 'A', onlyA: 1 },
            B: { common: 'B', onlyB: 2 },
            C: { $extends: ['A', 'B'], common: 'C' }
        }
        p.inherit(config_overlap).C.should.deep.equal({
            common: 'C',
            onlyA: 1,
            onlyB: 2
        })

        // Inheritance within arrays
        const config_array = {
            A: { a: 1 },
            B: [
                { $extends: 'A', b: 2 },
                { $extends: 'A', b: 3 }
            ]
        }
        p.inherit(config_array).B.should.deep.equal([
            { a: 1, b: 2 },
            { a: 1, b: 3 }
        ])

        // Support for $unset
        const config_unset = {
            A: { a: 1, b: 2 },
            B: { $extends: 'A', b: '$unset' }
        }
        p.inherit(config_unset).B.should.deep.equal({ a: 1 })

        // Deep chained inheritance
        const config_deep = {
            L1: { a: 1 },
            L2: { $extends: 'L1', b: 2 },
            L3: { $extends: 'L2', c: 3 },
            L4: { $extends: 'L3', d: 4 },
            L5: { $extends: 'L4', e: 5 }
        }
        p.inherit(config_deep).L5.should.deep.equal({ a: 1, b: 2, c: 3, d: 4, e: 5 })

        // Inheritance of arrays themselves
        const config_arr_inh = {
            base: [1, 2],
            extended: { $extends: 'base' }
        }
        p.inherit(config_arr_inh).extended.should.deep.equal([1, 2])

        // Inheritance of non-object/non-array types: string
        const config_primitive_inh_string = {
            base: 'primitive',
            extended: { $extends: 'base' }
        }
        p.inherit(config_primitive_inh_string).extended.should.equal('primitive')

        // Inheritance of non-object/non-array types: boolean
        const config_primitive_inh_boolean = {
            base: true,
            extended: { $extends: 'base' }
        }
        p.inherit(config_primitive_inh_boolean).extended.should.equal(true)

        // Inheritance of non-object/non-array types: number
        const config_primitive_inh_number = {
            base: 42,
            extended: { $extends: 'base' }
        }
        p.inherit(config_primitive_inh_number).extended.should.equal(42)
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
