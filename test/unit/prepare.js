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
        // $unset array slots stay undefined across subsequent array merges
        p.extend([1, 2], [null, '$unset'], [9]).should.deep.equal([9, undefined])
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

        // targets have to be fields of the config, not names inherited from Object.prototype
        for (const target of ['missing', 'a.missing', 'constructor', '__proto__', 'toString', 'a.hasOwnProperty']) {
            p.inherit.bind(this, {
                a: {x: 1},
                b: {$extends: target}
            }).should.throw(`"${target}" (reached from "b.$extends") does not name a valid inheritance target!`)
        }

        // null targets are still rejected
        p.inherit.bind(this, {
            nil: null,
            b: {$extends: 'nil'}
        }).should.throw('"nil" (reached from "b.$extends") does not name a valid inheritance target!')

        // non-string $extends values are rejected cleanly
        for (const [value, label] of [
            [null, 'null'],
            [123, '123'],
            [true, 'true'],
            [{}, '[object Object]'],
            [['a', null], 'null']
        ]) {
            p.inherit.bind(this, {
                a: {x: 1},
                b: {$extends: value}
            }).should.throw(`"${label}" (reached from "b.$extends") does not name a valid inheritance target!`)
        }

        // array breadcrumbs stay consistent regardless of visit order
        p.inherit.bind(this, {
            res: {$extends: 'list.0'},
            list: [{$extends: 'missing'}]
        }).should.throw('"missing" (reached from "list.[0].$extends") does not name a valid inheritance target!')
        p.inherit.bind(this, {
            list: [{$extends: 'missing'}],
            res: {$extends: 'list.0'}
        }).should.throw('"missing" (reached from "list.[0].$extends") does not name a valid inheritance target!')
        p.inherit.bind(this, {
            list: [{$extends: 'list.0'}]
        }).should.throw('"list.[0]" leads to a circular dependency!')
        p.inherit.bind(this, {
            res: {$extends: 'list.0'},
            list: [{$extends: 'list.0'}]
        }).should.throw('"list.[0]" leads to a circular dependency!')

        // Issue #100: Order of extends
        const config100 = {
            A: { prop: 'A' },
            B: { prop: 'B' },
            C: { $extends: ['A', 'B'] }
        }
        p.inherit(config100).C.prop.should.equal('B')

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

        // Support for $unset
        const config_unset = {
            A: { a: 1, b: 2 },
            B: { $extends: 'A', b: '$unset' }
        }
        p.inherit(config_unset).B.should.deep.equal({ a: 1 })

        // Inheritance of arrays themselves
        const config_arr_inh = {
            base: [1, 2],
            extended: { $extends: 'base' }
        }
        p.inherit(config_arr_inh).extended.should.deep.equal([1, 2])

        // Inheritance of non-object/non-array types: string, boolean and number
        const primitive_inh = p.inherit({
            string: 'primitive',
            boolean: true,
            number: 42,
            extended_string: { $extends: 'string' },
            extended_boolean: { $extends: 'boolean' },
            extended_number: { $extends: 'number' }
        })
        primitive_inh.extended_string.should.equal('primitive')
        primitive_inh.extended_boolean.should.equal(true)
        primitive_inh.extended_number.should.equal(42)

        // a list of non-object targets folds left to right, and a repeated target applies once
        const list_inh = p.inherit({
            arr1: [1, 2],
            arr2: [3],
            s1: 'one',
            s2: 'two',
            o: {k: 1},
            arrays: {$extends: ['arr1', 'arr2']},
            same_array: {$extends: ['arr1', 'arr1']},
            scalars: {$extends: ['s1', 's2']},
            same_scalar: {$extends: ['s1', 's1']},
            mixed: {$extends: ['o', 'arr2']},
            none: {$extends: []}
        })
        list_inh.arrays.should.deep.equal([3, 2])
        list_inh.same_array.should.deep.equal([1, 2])
        list_inh.scalars.should.equal('two')
        list_inh.same_scalar.should.equal('one')
        list_inh.mixed.should.deep.equal([3])
        // with no targets, the block stays an empty object
        list_inh.none.should.deep.equal({})

        // falsy scalars inherit cleanly at top level and in lists
        const falsy_inh = p.inherit({
            zero: 0,
            no: false,
            empty: '',
            num: 42,
            yes: true,
            str: 'text',
            obj: {k: 1},
            ext_zero: {$extends: 'zero'},
            ext_no: {$extends: 'no'},
            ext_empty: {$extends: 'empty'},
            empty_then_zero: {$extends: ['empty', 'zero']},
            zero_then_zero: {$extends: ['zero', 'zero']},
            num_then_zero: {$extends: ['num', 'zero']},
            yes_then_no: {$extends: ['yes', 'no']},
            str_then_empty: {$extends: ['str', 'empty']},
            obj_then_zero: {$extends: ['obj', 'zero']}
        })
        falsy_inh.ext_zero.should.equal(0)
        falsy_inh.ext_no.should.equal(false)
        falsy_inh.ext_empty.should.equal('')
        falsy_inh.empty_then_zero.should.equal(0)
        falsy_inh.zero_then_zero.should.equal(0)
        falsy_inh.num_then_zero.should.equal(0)
        falsy_inh.yes_then_no.should.equal(false)
        falsy_inh.str_then_empty.should.equal('')
        falsy_inh.obj_then_zero.should.equal(0)

        // string paths naming numeric or math-constant keys still resolve
        const special_key_inh = p.inherit({
            '1': {x: 1},
            e: {y: 2},
            a: {$extends: '1'},
            b: {$extends: 'e'}
        })
        special_key_inh.a.should.deep.equal({x: 1})
        special_key_inh.b.should.deep.equal({y: 2})
    })

    it('nested inherit', function() {
        // a child's own $extends beats what the parent's child inherits
        p.inherit({
            base_child: {b1: 10},
            A: {child: {b1: 99}},
            C: {$extends: 'A', child: {$extends: 'base_child'}}
        }).C.child.should.deep.equal({b1: 10})

        // fields only the parent's child has survive, explicit child fields win
        p.inherit({
            base_child: {b1: 10, b2: 20},
            A: {child: {b1: 99, b3: 30, b4: 40}},
            C: {$extends: 'A', child: {$extends: 'base_child', b2: 21, b4: 41}}
        }).C.child.should.deep.equal({b1: 10, b2: 21, b3: 30, b4: 41})

        // the child's $unset applies after its own targets...
        p.inherit({
            t: {k: 1, j: 2},
            A: {child: {k: 5}},
            C: {$extends: 'A', child: {$extends: 't', j: '$unset'}}
        }).C.child.should.deep.equal({k: 1})
        // ...and still reaches fields that only the parent's child has
        p.inherit({
            t: {k: 1},
            A: {child: {k: 5, z: 3}},
            C: {$extends: 'A', child: {$extends: 't', z: '$unset'}}
        }).C.child.should.deep.equal({k: 1})

        // two levels down, through a target that has its own nested $extends
        p.inherit({
            t: {k: 1, j: 2},
            u: {inner: {$extends: 't', m: 2}},
            A: {c: {inner: {k: 50}}},
            C: {$extends: 'A', c: {$extends: 'u'}}
        }).C.c.should.deep.equal({inner: {k: 1, j: 2, m: 2}})
        // two levels down, with the nested $extends written locally
        p.inherit({
            t: {k: 1, j: 2},
            A: {c: {inner: {k: 50, n: 3}}},
            C: {$extends: 'A', c: {inner: {$extends: 't', j: '$unset'}}}
        }).C.c.should.deep.equal({inner: {k: 1, n: 3}})

        // multiple child targets keep their left-to-right order
        const ordered = {
            x: {v: 'x', only_x: 1},
            y: {v: 'y', only_y: 2},
            A: {child: {v: 'A', only_A: 3}},
            C: {$extends: 'A', child: {$extends: ['x', 'y']}},
            D: {$extends: 'A', child: {$extends: ['y', 'x']}}
        }
        const ordered_res = p.inherit(ordered)
        ordered_res.C.child.should.deep.equal({v: 'y', only_x: 1, only_y: 2, only_A: 3})
        ordered_res.D.child.should.deep.equal({v: 'x', only_x: 1, only_y: 2, only_A: 3})
        // and a repeated target applies once
        p.inherit({
            x: {v: 'x', list: [1]},
            C: {child: {$extends: ['x', 'x']}}
        }).C.child.should.deep.equal({v: 'x', list: [1]})

        // diamonds resolve once, and results don't share mutable state
        const diamond = {
            root: {r: 1, list: [1, 2]},
            left: {$extends: 'root', l: 2},
            right: {$extends: 'root', r: 3},
            A: {child: {r: 0, a: 4}},
            C: {$extends: 'A', child: {$extends: ['left', 'right']}},
            D: {$extends: 'A', child: {$extends: ['left', 'right']}}
        }
        const diamond_res = p.inherit(diamond)
        diamond_res.C.child.should.deep.equal({r: 3, list: [1, 2], l: 2, a: 4})
        diamond_res.C.child.list.push(3)
        diamond_res.D.child.list.should.deep.equal([1, 2])
        diamond_res.root.list.should.deep.equal([1, 2])
        diamond.root.list.should.deep.equal([1, 2])
        diamond.C.child.should.deep.equal({$extends: ['left', 'right']})

        // children the parent doesn't have still resolve their own $extends
        p.inherit({
            t: {k: 1, j: 2},
            A: {child: {k: 5}, flag: true},
            C: {$extends: 'A', fresh: {inner: {$extends: 't', j: '$unset'}}, flag: {inner: {$extends: 't'}}}
        }).C.should.deep.equal({child: {k: 5}, fresh: {inner: {k: 1}}, flag: {inner: {k: 1, j: 2}}})

        // non-object targets still replace the parent's child
        p.inherit({
            n: 42,
            arr: [1, 2],
            A: {num: {x: 1}, list: {x: 1}},
            C: {$extends: 'A', num: {$extends: 'n'}, list: {$extends: 'arr'}}
        }).C.should.deep.equal({num: 42, list: [1, 2]})
        // ...including the parent's arrays and primitives, compared strictly
        p.inherit({
            arr: [9],
            one: 1,
            yes: true,
            A: {list: [1, 2, 3], str: '1', flag: 1, wrapped: [1]},
            C: {$extends: 'A', list: {$extends: 'arr'}, str: {$extends: 'one'}, flag: {$extends: 'yes'}, wrapped: {$extends: 'one'}}
        }).C.should.deep.equal({list: [9], str: 1, flag: true, wrapped: 1})
        // while literal arrays still merge by index
        p.inherit({
            A: {list: [1, 2, 3]},
            C: {$extends: 'A', list: [9]}
        }).C.list.should.deep.equal([9, 2, 3])
        // a list of non-object targets replaces the parent's child too, folded left to right
        p.inherit({
            arr1: [1, 2],
            arr2: [3],
            A: {list: {x: 1}},
            C: {$extends: 'A', list: {$extends: ['arr1', 'arr2']}}
        }).C.list.should.deep.equal([3, 2])

        // falsy scalar targets replace object and truthy parent values
        p.inherit({
            zero: 0,
            no: false,
            empty: '',
            A: {obj_num: {x: 1}, obj_bool: {x: 1}, obj_str: {x: 1}, num: 1, flag: true, text: 'hi'},
            C: {
                $extends: 'A',
                obj_num: {$extends: 'zero'},
                obj_bool: {$extends: 'no'},
                obj_str: {$extends: 'empty'},
                num: {$extends: 'zero'},
                flag: {$extends: 'no'},
                text: {$extends: 'empty'}
            }
        }).C.should.deep.equal({obj_num: 0, obj_bool: false, obj_str: '', num: 0, flag: false, text: ''})

        // array elements layer their own $extends the same way
        p.inherit({
            t: {k: 1, j: 2},
            A: {child: [{k: 5}]},
            C: {$extends: 'A', child: [{$extends: 't', j: '$unset'}]}
        }).C.child.should.deep.equal([{k: 1}])
        p.inherit({
            t: {k: 1, j: 2},
            A: {child: [{k: 5, z: 3}, {inner: {k: 5, n: 3}}]},
            C: {$extends: 'A', child: [{$extends: 't', j: 4}, {inner: {$extends: 't', j: '$unset'}}]}
        }).C.child.should.deep.equal([{k: 1, j: 4, z: 3}, {inner: {k: 1, n: 3}}])
        // null keeps a slot, $unset empties it, and extra slots are appended
        p.inherit({
            t: {k: 1},
            A: {child: [1, 2, {k: 5}]},
            C: {$extends: 'A', child: [null, '$unset', {$extends: 't'}, 4]}
        }).C.child.should.deep.equal([1, undefined, {k: 1}, 4])
        p.inherit.bind(this, {
            A: {child: [{}]},
            C: {$extends: 'A', child: [{$extends: 'missing'}]}
        }).should.throw('"missing" (reached from "C.child.[0].$extends")')

        // single targets don't share mutable state either, with or without a parent child
        for (const parent of [{child: {b1: 99}}, {}]) {
            const single_res = p.inherit({
                base_child: {b1: 10, list: [1, 2]},
                A: parent,
                C: {$extends: 'A', child: {$extends: 'base_child'}},
                D: {$extends: 'A', child: {$extends: 'base_child'}}
            })
            single_res.C.child.b1 = 0
            single_res.C.child.list.push(3)
            single_res.D.child.should.deep.equal({b1: 10, list: [1, 2]})
            single_res.base_child.should.deep.equal({b1: 10, list: [1, 2]})
        }

        // the parent's keys come first, and its nested objects are replaced
        // by a target's non-object value before the local fields apply
        const layered = p.inherit({
            t: {k: 1, j: 2, d: 4},
            A: {child: {z: 0, k: 5, d: {a: 1}}},
            C: {$extends: 'A', child: {$extends: 't', m: 3, d: {b: 1}}}
        }).C.child
        layered.should.deep.equal({z: 0, k: 1, d: {b: 1}, j: 2, m: 3})
        Object.keys(layered).should.deep.equal(['z', 'k', 'd', 'j', 'm'])

        // $unset array slots stay undefined across multi-step inheritance and merges
        const unset_arr = p.inherit({
            A: {shift: [10, 20]},
            B: {$extends: 'A', shift: [null, '$unset']},
            X: {rotate: 15},
            C: {$extends: 'B'},
            D: {$extends: 'B', rotate: 15},
            E: {$extends: 'B', shift: [5]},
            F: {$extends: ['B', 'X']}
        })
        unset_arr.B.should.deep.equal({shift: [10, undefined]})
        unset_arr.C.should.deep.equal({shift: [10, undefined]})
        unset_arr.D.should.deep.equal({shift: [10, undefined], rotate: 15})
        unset_arr.E.should.deep.equal({shift: [5, undefined]})
        unset_arr.F.should.deep.equal({shift: [10, undefined], rotate: 15})

        // null local overrides keep cached target arrays isolated
        const null_res = p.inherit({
            A: {list: [1, 2]},
            C: {$extends: 'A', list: null},
            D: {$extends: 'A'}
        })
        null_res.C.list.push(3)
        null_res.A.list.should.deep.equal([1, 2])
        null_res.D.list.should.deep.equal([1, 2])

        // sparse array holes in an extending object become explicit undefined slots
        const sparse = [1, , 3]
        const sparse_res = p.inherit({
            A: {x: 1},
            B: {$extends: 'A', arr: sparse}
        })
        sparse_res.B.arr.should.deep.equal([1, undefined, 3])
        Object.keys(sparse_res.B.arr).should.deep.equal(['0', '1', '2'])

        // nested errors keep pointing to the nested field
        p.inherit.bind(this, {
            A: {child: {}},
            C: {$extends: 'A', child: {$extends: 'missing'}}
        }).should.throw('"missing" (reached from "C.child.$extends")')
        p.inherit.bind(this, {
            A: {child: {}},
            C: {$extends: 'A', child: {$extends: 'C'}}
        }).should.throw('circular dependency')
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
        // while own properties of a referenced string do
        p.concat({s: 'abc', res: '$concat(s.length, "-", s.0)'}).res.should.equal('3-a')

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

    it('concat breadcrumbs', function() {
        const invalid = config => p.concat.bind(this, config)

        // errors inside a referenced field name that field, not the one referencing it
        invalid({a: '$concat(b)', b: '$concat(missing)'}).should.throw('reference "missing" in $concat at "b"')
        invalid({a: '$concat(b)', b: '$concat(oops'}).should.throw('"$concat(oops" at "b"')
        invalid({a: '$concat(b)', b: '$concat(c)', c: {}}).should.throw('Reference "c" in $concat at "b"')
        invalid({meta: {
            title: '$concat(meta.board, " rev ", meta.rev)',
            board: '$concat(meta.prefix, "-split")',
            rev: 2
        }}).should.throw('reference "meta.prefix" in $concat at "meta.board"')

        // array elements are named the same way, whether referenced or visited first
        invalid({res: '$concat(list.1)', list: ['x', '$concat(missing)']}).should.throw('at "list.[1]"')
        invalid({list: ['x', '$concat(missing)'], res: '$concat(list.1)'}).should.throw('at "list.[1]"')

        // a cycle is reported at the field where it closes
        invalid({a: '$concat(b)', b: '$concat(c)', c: '$concat(b)'}).should.throw('"$concat(c)" at "b"')
        invalid({list: ['$concat(list.0)']}).should.throw('"$concat(list.0)" at "list.[0]"')
    })

    it('concat reuse', function() {
        // a referenced field is resolved once and used everywhere
        p.concat({meta: {
            title: '$concat(meta.board, " rev ", meta.rev)',
            board: '$concat(meta.prefix, "-split")',
            prefix: 'corney',
            rev: 2
        }}).meta.should.deep.equal({title: 'corney-split rev 2', board: 'corney-split', prefix: 'corney', rev: 2})

        // a dotted key and the nested field it spells out stay separate
        p.concat({
            x: 'x',
            y: 'y',
            'a.b': '$concat(x)',
            a: {b: '$concat(y)'}
        }).should.deep.equal({x: 'x', y: 'y', 'a.b': 'x', a: {b: 'y'}})

        // each level references the previous one twice, so following every
        // reference again would read "l0" 2^40 times to resolve "l40"
        let reads = 0
        const chain = {
            get l0() {
                // fail at once rather than hang
                if (++reads > 10) throw new Error('"l0" was read too often')
                return ''
            }
        }
        for (let i = 1; i <= 40; i++) chain[`l${i}`] = `$concat(l${i - 1}, l${i - 1})`
        p.concat(chain).l40.should.equal('')
    })
})
