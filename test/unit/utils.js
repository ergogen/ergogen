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


    describe('svg paths to outline', function() {

        this.timeout(120000)

        const ergogen = require('../../src/ergogen')
        const square = 'M 0 0 L 10 0 L 10 10 L 0 10 Z'
        const inner = 'M 3 3 L 7 3 L 7 7 L 3 7 Z'
        const shifted = 'M 5 5 L 15 5 L 15 15 L 5 15 Z'
        const open = 'M 20 20 L 30 20'

        const round = val => Number(val.toFixed(6)) + 0
        const extents = model => {
            const {low, high} = m.measure.modelExtents(model)
            return [low.map(round), high.map(round)]
        }
        const shape = async (part, points={zones: {matrix: null}}) => {
            const results = await ergogen.process({points, outlines: {o: [{what: 'svg', where: true, ...part}]}}, {debug: true})
            const model = results.outlines.o.yaml
            return {bounds: extents(model), chains: m.model.findChains(model).length}
        }
        const reject = (part, snippet) => shape(part).should.be.rejectedWith(snippet)
        const malformed = [
            ['M 0 0 C 1 1 2 2', 'Path 0 for SVG outline "outlines.o.0" has invalid path data, the command "C" at offset 6 takes 6 arguments per segment, not 4'],
            ['M 0 0 Q 1 1', 'the command "Q" at offset 6 takes 4 arguments per segment, not 2'],
            ['M 0 0 S 1 1', 'the command "S" at offset 6 takes 4 arguments per segment, not 2'],
            ['M 0 0 T 1', 'the command "T" at offset 6 takes 2 arguments per segment, not 1'],
            ['M 0 0 L 10 0 L 10 10 L 4 Z', 'the command "L" at offset 21 takes 2 arguments per segment, not 1'],
            ['M 0 0 L 10 0 L 10 10 L 0 Z', 'the command "L" at offset 21 takes 2 arguments per segment, not 1'],
            ['M 0 0 H 10 V 10 H Z', 'the command "H" at offset 16 takes 1 argument per segment, not 0'],
            ['M 0 L 10 0 L 10 10 Z', 'the command "M" at offset 0 takes 2 arguments per segment, not 1'],
            ['M 0 0 L 1e999 0 L 0 10 Z', 'the number "1e999" at offset 8 is not finite'],
            [[square, `${square} X`], 'Path 1 for SVG outline "outlines.o.0" has invalid path data, unexpected "X" at offset 30'],
            [`${square} R 1 2`, 'unexpected "R" at offset 30'],
        ]

        it('accuracy', async function() {
            // only a missing accuracy gets the default, and it has to be positive and finite
            await reject({paths: square, accuracy: 0}, 'Field "outlines.o.0.accuracy" should be a positive finite number')
            await reject({paths: square, accuracy: -1}, 'should be a positive finite number')
            await reject({paths: square, accuracy: 'Infinity'}, 'should be a positive finite number')
            await reject({paths: square, accuracy: 'a'}, 'Field "outlines.o.0.accuracy" should be of type number')
            ;(await shape({paths: square, accuracy: 0.01})).chains.should.equal(1)
            ;(await shape({paths: square})).chains.should.equal(1)
        })

        it('validation without placements', async function() {
            // paths are validated when the part is set up, even when nothing gets placed
            const unplaced = (paths, snippet) => shape({paths, where: false}).should.be.rejectedWith(snippet)
            await unplaced('', 'Path 0 for SVG outline "outlines.o.0" cannot be empty')
            await unplaced('  ', 'cannot be empty')
            await unplaced([square, 12], 'Path 1 for SVG outline "outlines.o.0" must be a string')
            await unplaced('M 0 0', 'Path 0 for SVG outline "outlines.o.0" does not contain any geometry')
            await unplaced('garbage', 'Path 0 for SVG outline "outlines.o.0" has invalid path data, unexpected "g" at offset 0')
            await unplaced('M 0 0 L 10 0 L 10 10', 'SVG paths need to be closed shapes (check failed for path 0 of "outlines.o.0")')
            await unplaced([], 'must have at least one path')
            await unplaced(12, 'must be a string or an array')
            // malformed path data is rejected before makerjs could misread it (or hang on it)
            for (const [paths, snippet] of malformed) {
                await unplaced(paths, snippet)
            }
            // valid paths without placements produce nothing
            ;(await ergogen.process({points: {zones: {matrix: null}}, outlines: {o: [{what: 'svg', where: false, paths: square}]}}, {debug: true}))
                .outlines.o.yaml.models.export.models.should.deep.equal({})
        })

        it('import errors', async function() {
            // importer exceptions are named, with the original as their cause
            const cause = new Error('importer failure')
            sinon.stub(m.importer, 'fromSVGPathData').callThrough().onSecondCall().throws(cause)
            const error = await shape({paths: [square, inner], where: false}).should.be.rejectedWith('Path 1 for SVG outline "outlines.o.0" could not be imported: importer failure')
            error.cause.should.equal(cause)
        })

        it('normalized path data', async function() {
            // compact path data reaches makerjs with its tokens separated, so it reads the same numbers
            // so the compressed arc flags give a closed half circle, not NaN geometry
            const spy = sinon.spy(m.importer, 'fromSVGPathData')
            ;(await shape({paths: 'M10 0h-10a5,5 0 0110,0z'})).should.deep.equal({bounds: [[0, 0], [10, 5]], chains: 1})
            spy.firstCall.args[0].should.equal('M 10 0 h -10 a 5 5 0 0 1 10 0 z')
        })

        it('repeated horizontal and vertical lines', async function() {
            // makerjs reads only the first argument of "H" and "V", so repeats must match explicit commands
            const outline = async paths => {
                const model = (await ergogen.process({points: {zones: {matrix: null}}, outlines: {o: [{what: 'svg', where: true, paths}]}}, {debug: true})).outlines.o.yaml
                return {bounds: extents(model), length: round(m.measure.modelPathLength(model))}
            }
            const unit = {bounds: [[0, -10], [10, 0]], length: 40}
            for (const [repeated, explicit, expected] of [
                ['M0 0H5 10V10H0Z', 'M0 0H5H10V10H0Z', unit],
                ['M0 0h5 5v10h-10z', 'M0 0h5h5v10h-10z', unit],
                ['M0 0V5 10H10V0Z', 'M0 0V5V10H10V0Z', unit],
                ['M0 0v5 5h10v-10z', 'M0 0v5v5h10v-10z', unit],
                ['M0 0h12 -2v10h-10z', 'M0 0h12h-2v10h-10z', {bounds: [[0, -10], [12, 0]], length: 42}],
            ]) {
                ;(await outline(explicit)).should.deep.equal(expected, explicit)
                ;(await outline(repeated)).should.deep.equal(expected, repeated)
            }
        })

        it('every path is closed', async function() {
            // loose segments only
            await reject({paths: 'M 0 0 L 10 10'}, 'check failed for path 0')
            // a closed and an open subpath within one path
            await reject({paths: `${square} ${open}`}, 'check failed for path 0')
            // an open, empty or move-only path cannot hide behind a valid one
            await reject({paths: [square, open]}, 'check failed for path 1')
            await reject({paths: [square, 'M 0 0 L 10 0 L 10 10']}, 'check failed for path 1')
            await reject({paths: [square, '']}, 'Path 1 for SVG outline "outlines.o.0" cannot be empty')
            await reject({paths: [square, 'M 5 5']}, 'Path 1 for SVG outline "outlines.o.0" does not contain any geometry')
            await reject({paths: [open, square]}, 'check failed for path 0')
        })

        it('topology', async function() {
            // subpaths within a single path keep their holes and crossings
            ;(await shape({paths: `${square} ${inner}`})).should.deep.equal({bounds: [[0, -10], [10, 0]], chains: 2})
            ;(await shape({paths: `${square} ${shifted}`})).should.deep.equal({bounds: [[0, -15], [15, 0]], chains: 2})
            // separate paths are unioned
            ;(await shape({paths: [square, inner]})).should.deep.equal({bounds: [[0, -10], [10, 0]], chains: 1})
            ;(await shape({paths: [square, shifted]})).should.deep.equal({bounds: [[0, -15], [15, 0]], chains: 1})
        })

        it('import once per part', async function() {
            const spy = sinon.spy(m.importer, 'fromSVGPathData')
            const points = {zones: {matrix: {columns: {a: null, b: null, c: null}}}}
            ;(await shape({paths: [square, inner]}, points)).chains.should.equal(3)
            spy.callCount.should.equal(2)
        })

        it('independent placements', async function() {
            // every placement (mirrored or not) gets its own copy of the cached shape
            const points = {zones: {matrix: {columns: {a: null, b: null}}}, mirror: {distance: 60}}
            const results = await ergogen.process({points, outlines: {
                o: [{what: 'svg', where: true, paths: 'M 0 0 L 4 0 L 0 2 Z'}],
                rotated: [{what: 'svg', where: true, adjust: {rotate: 90}, paths: 'M 0 0 L 4 0 L 0 2 Z'}],
            }}, {debug: true})
            const chains = name => m.model.findChains(results.outlines[name].yaml)
                .map(chain => extents(m.chain.toNewModel(chain)))
                .sort((x, y) => x[0][0] - y[0][0])
            chains('o').should.deep.equal([
                [[0, -2], [4, 0]],
                [[19, -2], [23, 0]],
                [[37, -2], [41, 0]],
                [[56, -2], [60, 0]],
            ])
            chains('rotated').should.deep.equal([
                [[0, 0], [2, 4]],
                [[19, 0], [21, 4]],
                [[39, 0], [41, 4]],
                [[58, 0], [60, 4]],
            ])
        })

        it('fixed paths', async function() {
            // the built-in socket has its own path data, so `paths` would be silently ignored
            await ergogen.process({
                points: {zones: {matrix: null}},
                outlines: {o: [{what: 'choc_hotswap_socket', where: true, paths: square}]}
            }).should.be.rejectedWith('Unexpected key "paths" within field "outlines.o.0"')
        })
    })
})