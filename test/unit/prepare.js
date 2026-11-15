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

    it('concat', function() {
        // should concatenate references and literals
        const config1 = {
            meta: {
                name: 'ThinkCorney',
                version: 'v1-b1',
                name_full: '$concat(meta.name, "-", meta.version)'
            }
        }
        const unnested = p.unnest(config1)
        const result1 = p.concat(unnested)
        result1.meta.name_full.should.equal('ThinkCorney-v1-b1')

        // should handle multiple references and literals
        const config2 = {
            a: 'foo',
            b: 'bar',
            c: 'baz',
            res: '$concat(a, " and ", b, " and ", c)'
        }
        p.concat(config2).res.should.equal('foo and bar and baz')

        // should handle nested concats
        const config3 = {
            a: 'foo',
            b: 'bar',
            res: '$concat(a, $concat("-", b))'
        }
        p.concat(config3).res.should.equal('foo-bar')

        // should handle references to non-string values
        const config4 = {
            name: 'engine',
            version: 4.0,
            res: '$concat(name, ": ", version)'
        }
        p.concat(config4).res.should.equal('engine: 4')

        // should throw on circular dependencies
        const config5 = {
            a: '$concat(b)',
            b: '$concat(a)'
        }
        p.concat.bind(this, config5).should.throw('Circular dependency')

        // should throw on unresolved references
        const config6 = {
            res: '$concat(nonexistent)'
        }
        p.concat.bind(this, config6).should.throw('Could not resolve reference')

        // should handle mixed quotes and escaped quotes in literals
        const config7 = {
            res: '$concat("double", \'single\', "contains \\"quotes\\"")'
        }
        p.concat(config7).res.should.equal('doublesinglecontains "quotes"')

        // should handle nested quotes of different types
        const config8 = {
            res: '$concat("it\'s a test", \'he said "hello"\')'
        }
        p.concat(config8).res.should.equal('it\'s a testhe said "hello"')

        // should handle empty or whitespace-only arguments
        const config9 = {
            empty: '$concat()',
            whitespace: '$concat( )',
            mixed: '$concat(a, , b)',
            a: 'foo',
            b: 'bar'
        }
        const res9 = p.concat(config9)
        res9.empty.should.equal('')
        res9.whitespace.should.equal('')
        res9.mixed.should.equal('foobar')
    })

    it('concat escapes', function() {
        const config = {a: 'foo', b: 'bar'}
        const concat = res => p.concat({...config, res}).res

        // a trailing escaped backslash closes the literal, in both quote styles
        concat(String.raw`$concat("folder\\", "file")`).should.equal(String.raw`folder\file`)
        concat(String.raw`$concat('folder\\', 'file')`).should.equal(String.raw`folder\file`)

        // even and odd runs of backslashes before a quote
        concat(String.raw`$concat("a\\\\")`).should.equal(String.raw`a\\`)
        concat(String.raw`$concat("a\\\"b")`).should.equal(String.raw`a\"b`)
        concat(String.raw`$concat('a\\\'b')`).should.equal(String.raw`a\'b`)

        // a single escaped quote
        concat(String.raw`$concat("say \"hi\"")`).should.equal('say "hi"')

        // nested calls and references after such literals
        concat(String.raw`$concat("x\\", $concat(a, "\\"), b)`).should.equal(String.raw`x\foo\bar`)
    })

    it('concat line terminators', function() {
        const concat = res => p.concat({res}).res

        // a backslash before a line terminator is kept, in both quote styles
        for (const terminator of ['\n', '\r', '\u2028', '\u2029', '\r\n']) {
            concat(`$concat("a\\${terminator}b")`).should.equal(`a\\${terminator}b`)
            concat(`$concat('a\\${terminator}b')`).should.equal(`a\\${terminator}b`)
        }

        // an escaped backslash before a line terminator still pairs up
        concat('$concat("a\\\\\nb")').should.equal('a\\\nb')
    })

    it('concat syntax', function() {
        const config = {a: 'foo', b: 'bar', c: 'baz'}
        const concat = res => p.concat({...config, res}).res
        const invalid = res => p.concat.bind(this, {...config, res})

        // sibling calls and trailing tokens
        invalid('$concat("a") + $concat("b")').should.throw('Invalid $concat expression')
        invalid('$concat(a) - $concat(b, c)').should.throw('trailing')
        invalid('$concat(a))').should.throw('trailing')
        invalid('$concat(a) ').should.throw('trailing')

        // extra tokens inside an argument
        invalid('$concat("a" + "b")').should.throw('unexpected "+"')
        invalid('$concat(a b)').should.throw('unexpected "b"')
        invalid('$concat((a)').should.throw('unexpected "("')
        invalid('$concat(a(b))').should.throw('unexpected "("')
        invalid('$concat("a""b")').should.throw('unexpected """')
        invalid('$concat($concat(a)b)').should.throw('unexpected "b"')

        // a single quote character is not a literal
        invalid('$concat(")').should.throw('unterminated')
        invalid('$concat(\')').should.throw('unterminated')
        invalid('$concat("abc)').should.throw('unterminated')
        invalid('$concat("abc\\').should.throw('unterminated')

        // a missing closing parenthesis is still validated
        invalid('$concat(').should.throw('missing closing parenthesis')
        invalid('$concat(a').should.throw('missing closing parenthesis')
        invalid('$concat("a"').should.throw('missing closing parenthesis')
        invalid('$concat(a, $concat(b)').should.throw('missing closing parenthesis')

        // errors name the field
        invalid('$concat(a').should.throw('at "res"')

        // nested calls and empty arguments stay valid
        concat('$concat(a, $concat("-", $concat(b, c)))').should.equal('foo-barbaz')
        concat('$concat( a ,b , )').should.equal('foobar')
        concat('$concat(,)').should.equal('')

        // strings that are not a $concat expression are left alone
        concat('concat(a)').should.equal('concat(a)')
        concat(' $concat(a)').should.equal(' $concat(a)')
        concat('prefix $concat(a)').should.equal('prefix $concat(a)')
        concat('$concat').should.equal('$concat')
    })

    it('concat references', function() {
        // string, number and boolean primitives, including falsy ones
        p.concat({
            zero: 0,
            no: false,
            yes: true,
            arr: ['p', 'q'],
            res: '$concat(zero, no, yes, arr.1)'
        }).res.should.equal('0falsetrueq')

        // objects, arrays and null are rejected
        p.concat.bind(this, {meta: {x: 1}, res: '$concat(meta)'}).should.throw('should be a string, number or boolean, not object')
        p.concat.bind(this, {arr: ['a', 'b'], res: '$concat(arr)'}).should.throw('not array')
        p.concat.bind(this, {nothing: null, res: '$concat(nothing)'}).should.throw('not null')

        // paths through primitives and inherited properties do not resolve
        p.concat.bind(this, {a: 'x', res: '$concat(a.b)'}).should.throw('Could not resolve reference "a.b"')
        p.concat.bind(this, {res: '$concat(constructor)'}).should.throw('Could not resolve reference')
        p.concat.bind(this, {s: 'abc', res: '$concat(s.toString)'}).should.throw('Could not resolve reference "s.toString"')

        // a failed lookup does not mutate the config
        const config = {a: {}, res: '$concat(missing.sub, a.deeper.still)'}
        p.concat.bind(this, config).should.throw('Could not resolve reference "missing.sub"')
        config.should.deep.equal({a: {}, res: '$concat(missing.sub, a.deeper.still)'})
        const config2 = {a: {}, res: '$concat(a.deeper.still)'}
        p.concat.bind(this, config2).should.throw('Could not resolve reference "a.deeper.still"')
        config2.should.deep.equal({a: {}, res: '$concat(a.deeper.still)'})

        // paths through null or undefined values do not resolve
        p.concat.bind(this, {nothing: null, res: '$concat(nothing.sub)'}).should.throw('Could not resolve reference "nothing.sub"')
        p.concat.bind(this, {nothing: undefined, res: '$concat(nothing.sub)'}).should.throw('Could not resolve reference "nothing.sub"')

        // cycles through nested calls are still detected
        p.concat.bind(this, {a: '$concat("x", $concat(a))'}).should.throw('Circular dependency')
    })

    it('concat string properties', function() {
        // own properties of a referenced string resolve
        p.concat({s: 'abc', res: '$concat(s.length, "-", s.0)'}).res.should.equal('3-a')
    })
})
