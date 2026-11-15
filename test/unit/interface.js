const yaml = require('js-yaml')
const ergogen = require('../../src/ergogen')
const version = require('../../package.json').version
const {fixture} = require('../helpers/fixture')

// fixtures
const minimal = fixture('minimal.yaml')
const medium = fixture('medium.yaml')
const big = fixture('big.yaml')
const minimal_kle = fixture('minimal_kle.json')
const atreus_kle = fixture('atreus_kle.json')

describe('Interface', function() {

    this.timeout(120000)
    this.slow(120000)

    it('debug', async function() {
        // to check whether the output has "private" exports
        const underscore = obj => {
            for (const val of Object.values(obj)) {
                for (const key of Object.keys(val)) {
                    if (key.startsWith('_')) return true
                }
            }
            return false
        }
        underscore(await ergogen.process(minimal)).should.be.false
        underscore(await ergogen.process(big, {debug: false})).should.be.false
        underscore(await ergogen.process(big, {debug: true})).should.be.true
    })

    it('formats', async function() {
        const logger = msg => {
            if (msg.startsWith('Interpreting format:')) {
                throw msg.split(':')[1].trim()
            }
        }
        return Promise.all([
            ergogen.process(minimal, {debug: true}, logger).should.be.rejectedWith('OBJ'),
            ergogen.process(yaml.dump(minimal), {debug: true}, logger).should.be.rejectedWith('YAML'),
            ergogen.process(`
                //:
                return {points: {}}
            `, {debug: true}, logger).should.be.rejectedWith('JS'),
            ergogen.process(`
                //:
                return 'not an object';
            `, {debug: true}, logger).should.be.rejectedWith('not valid'),
            ergogen.process(minimal_kle, {debug: true}, logger).should.be.rejectedWith('KLE'),
            ergogen.process(atreus_kle, {debug: true}, logger).should.be.rejectedWith('KLE'),
            ergogen.process('not an object', {debug: true}, logger).should.be.rejectedWith('object'),
            ergogen.process({}, {debug: true}, logger).should.be.rejectedWith('empty'),
            ergogen.process({not_points: {}}, {debug: true}, () => {}).should.be.rejectedWith('points clause'),
            ergogen.process({points: {zones: {}}}, {debug: true}, () => {}).should.be.rejectedWith('any points')
        ])
    })

    it('preprocessor', async function() {
        return Promise.all([
            // unnesting
            ergogen.process({'points.zones.matrix': {}}).should.eventually.have.deep.property('canonical', {
                points: {zones: {matrix: {}}}
            }),
            // inheritance
            ergogen.process({
                'points.zones.parent.key.a': 1,
                'points.zones.child': {
                    '$extends': 'points.zones.parent',
                    'key.b': 2
                }
            }).should.eventually.have.deep.nested.property('canonical.points.zones.child.key', {
                a: 1,
                b: 2
            }),
            // parameterization
            ergogen.process({
                'points.zones.matrix.key': {
                    a: 'PAR',
                    $params: ['PAR'],
                    $args: [1]
                }
            }).should.eventually.have.deep.nested.property('canonical.points.zones.matrix.key', {
                a: '1'
            })
        ])
    })
    
    it('reserved keys', async function() {
        const reserved = (config, field, key) => ergogen.process(config).should.be.rejectedWith(
            `Reserved key "${key}" within field "${field}"`
        )
        const structure = 'this block is already a key-level config; move its fields up one level!'
        const metadata = 'it is reserved for engine-managed point metadata!'
        const zone = {'points.zones.matrix': {}}
        return Promise.all([
            // every reserved name, with a reason fitting the name
            ergogen.process({...zone, 'points.key.key': {}}).should.be.rejectedWith(
                `Reserved key "key" within field "points.key": ${structure}`
            ),
            reserved({...zone, 'points.key.zones': {}}, 'points.key', 'zones'),
            reserved({...zone, 'points.key.columns': {}}, 'points.key', 'columns'),
            reserved({...zone, 'points.key.rows': {}}, 'points.key', 'rows'),
            ergogen.process({...zone, 'points.key.zone': 'z'}).should.be.rejectedWith(
                `Reserved key "zone" within field "points.key": ${metadata}`
            ),
            reserved({...zone, 'points.key.col': 'c'}, 'points.key', 'col'),
            reserved({...zone, 'points.key.row': 'r'}, 'points.key', 'row'),
            // every key-level site, with dotted unnesting
            reserved({'points.zones.matrix.key.rows': {}}, 'points.zones.matrix.key', 'rows'),
            reserved({'points.zones.matrix.columns.c.key.columns': {}}, 'points.zones.matrix.columns.c.key', 'columns'),
            reserved({'points.zones.matrix.rows.r.key.width': 30}, 'points.zones.matrix.rows.r', 'key'),
            reserved({'points.zones.matrix.columns.c.rows.r.col': 'c'}, 'points.zones.matrix.columns.c.rows.r', 'col'),
            // immediate mirror overrides can't restructure, even without an active mirror
            reserved({...zone, 'points.key.mirror.key': {}}, 'points.key.mirror', 'key'),
            reserved({'points.zones.matrix.key.mirror.zones': {}}, 'points.zones.matrix.key.mirror', 'zones'),
            reserved({'points.zones.matrix.columns.c.key.mirror.columns': {}}, 'points.zones.matrix.columns.c.key.mirror', 'columns'),
            reserved({'points.zones.matrix.rows.r.mirror.rows': {}}, 'points.zones.matrix.rows.r.mirror', 'rows'),
            reserved({'points.zones.matrix.columns.c.rows.r.mirror.key': {}}, 'points.zones.matrix.columns.c.rows.r.mirror', 'key'),
            // inherited declarations are reported where they are used
            reserved({
                'shared.row.key.width': 30,
                'points.zones.matrix.rows.r.$extends': 'shared.row'
            }, 'points.zones.matrix.rows.r', 'key'),
            // an unset only resolves away through inheritance, otherwise the field survives
            reserved({'points.zones.matrix.rows.r.key': '$unset'}, 'points.zones.matrix.rows.r', 'key'),
            // later merge levels (or skipping the keys) can't rescue a surviving declaration
            reserved({
                'points.zones.matrix.key.skip': true,
                'points.zones.matrix.rows.r.key.width': 30,
                'points.zones.matrix.columns.c.rows.r': '$unset'
            }, 'points.zones.matrix.rows.r', 'key'),
            // inheriting and unsetting in the same object is fine
            ergogen.process({
                'shared.row': {key: {width: 30}, height: 20},
                'points.zones.matrix.rows.r': {$extends: 'shared.row', key: '$unset'}
            }).should.eventually.have.nested.property('points.matrix_default_r.meta.height', 20)
        ])
    })

    it('unreserved metadata', async function() {
        const names = result => Object.keys(result.points)

        // column-level row unsets still work, without new row type checks
        names(await ergogen.process({'points.zones.matrix': {
            rows: {a: {}, b: {}},
            columns: {c: {rows: {a: '$unset'}}, d: {}}
        }})).should.deep.equal(['matrix_c_b', 'matrix_d_a', 'matrix_d_b'])
        names(await ergogen.process({'points.zones.matrix': {
            rows: {gone: 123, keep: {}},
            columns: {single: {rows: {gone: '$unset'}}}
        }})).should.deep.equal(['matrix_single_keep'])

        // nested custom metadata isn't inspected, and prototype names aren't reserved
        const custom = (await ergogen.process({
            'points.zones.matrix': {},
            'points.key': {custom: {key: 1, rows: 2, col: 3}, toString: 'ts', constructor: 'ctor'}
        })).points.matrix.meta
        custom.custom.should.deep.equal({key: 1, rows: 2, col: 3})
        custom.toString.should.equal('ts')
        custom.constructor.should.equal('ctor')

        // allowed metadata can be consumed by templates and filters
        const consumed = await ergogen.process({
            'points.zones.matrix.columns': {
                one: {key: {'anchor.pin': 'P1'}},
                two: {key: {'anchor.pin': 'P2'}}
            },
            'points.key': {'extra.net': 'GND', label: '{{anchor.pin}}_{{extra.net}}'},
            'outlines.pins.main': {what: 'rectangle', where: 'meta.anchor.pin ~ P1', size: 4}
        }, {debug: true})
        consumed.points.matrix_one.meta.label.should.equal('P1_GND')
        consumed.points.matrix_two.meta.label.should.equal('P2_GND')
        const lines = consumed.outlines.pins.dxf.split('\n').filter(line => line.trim() == 'LINE')
        lines.length.should.equal(4) // a single rectangle, around the P1 key only

        // mirror overrides keep their null/false/$unset semantics, and can relabel rows
        const mirrored = (await ergogen.process({
            'points.mirror': 100,
            'points.key.mirror.width': 30,
            'points.zones.matrix.columns.c': {},
            'points.zones.matrix.rows': {
                inherit: {mirror: null},
                cleared: {mirror: false},
                unset: {mirror: '$unset'},
                relabel: {mirror: {row: 'P1', mirror: {key: 'inner'}}}
            }
        })).points
        mirrored.mirror_matrix_c_inherit.meta.width.should.equal(30)
        mirrored.mirror_matrix_c_cleared.meta.width.should.equal(18)
        mirrored.mirror_matrix_c_unset.meta.width.should.equal(18)
        mirrored.mirror_matrix_c_relabel.meta.row.should.equal('P1')
        mirrored.matrix_c_relabel.meta.mirror.mirror.should.deep.equal({key: 'inner'})
    })

    it('mirror overrides', async function() {
        const mirrored = {'points.mirror': 100, 'points.zones.matrix.columns.c': {}}
        const invalid = (config, field, _type) => ergogen.process({...mirrored, ...config}).should.be.rejectedWith(
            `Field "${field}" should be of type ${_type}!`
        )

        await Promise.all([
            // the override itself has to be an object (or one of the clearing forms)
            invalid({'points.key.mirror': 'oops'}, 'matrix_c.mirror', 'object'),
            invalid({'points.key.mirror': 5}, 'matrix_c.mirror', 'object'),
            invalid({'points.key.mirror': true}, 'matrix_c.mirror', 'object'),
            invalid({'points.key.mirror': [{width: 30}]}, 'matrix_c.mirror', 'object'),
            // checked on the merged key, so the breadcrumb names the affected key
            invalid({'points.zones.matrix.rows.r.mirror': 'oops'}, 'matrix_c_r.mirror', 'object'),
            // zone and column references can be relabeled, but not replaced
            invalid({'points.key.mirror.zone': 'z'}, 'matrix_c.mirror.zone', 'object'),
            invalid({'points.key.mirror.zone': '$unset'}, 'matrix_c.mirror.zone', 'object'),
            invalid({'points.key.mirror.zone.columns': '$unset'}, 'matrix_c.mirror.zone.columns', 'object'),
            invalid({'points.key.mirror.col': 'c'}, 'matrix_c.mirror.col', 'object'),
            // zone-level mirroring goes through the same checks
            ergogen.process({
                'points.zones.matrix': {mirror: 100, columns: {c: {}}},
                'points.key.mirror.zone': 'z'
            }).should.be.rejectedWith('Field "matrix_c.mirror.zone" should be of type object!')
        ])

        // without an active mirror, or for source-only keys, the override stays inert metadata
        const inert = (await ergogen.process({'points.zones.matrix': {}, 'points.key.mirror': 'oops'})).points
        inert.matrix.meta.mirror.should.equal('oops')
        const source = (await ergogen.process({
            ...mirrored, 'points.key': {asym: 'source', mirror: {zone: 'z'}}
        })).points
        Object.keys(source).should.deep.equal(['matrix_c'])

        // a later level can clear an invalid override before it's used
        const cleared = (await ergogen.process({
            ...mirrored,
            'points.key.mirror': {zone: 'z', col: 'c', width: 30},
            'points.zones.matrix.rows': {
                unset: {mirror: {zone: '$unset', col: '$unset'}},
                cleared: {mirror: false},
                replaced: {mirror: {zone: {name: 'thumb'}, col: {name: 'outer'}}}
            }
        })).points
        cleared.mirror_matrix_c_unset.meta.width.should.equal(30)
        cleared.mirror_matrix_c_unset.meta.zone.name.should.equal('matrix')
        cleared.mirror_matrix_c_unset.meta.col.name.should.equal('c')
        cleared.mirror_matrix_c_cleared.meta.width.should.equal(18)
        cleared.mirror_matrix_c_replaced.meta.zone.name.should.equal('thumb')
        cleared.mirror_matrix_c_replaced.meta.col.name.should.equal('outer')

        // valid relabels keep the rest of the shared structure, and nested metadata isn't inspected
        const relabeled = (await ergogen.process({
            ...mirrored,
            'points.zones.matrix.columns.d': {},
            'points.key.mirror': {
                zone: {name: 'thumb', label: 5},
                col: {name: 'outer'},
                row: 7,
                custom: 'anything',
                mirror: 'inert'
            }
        })).points
        const relabeled_meta = relabeled.mirror_matrix_c.meta
        relabeled_meta.zone.name.should.equal('thumb')
        relabeled_meta.zone.label.should.equal(5)
        Object.keys(relabeled_meta.zone.columns).should.deep.equal(['c', 'd'])
        relabeled_meta.col.name.should.equal('outer')
        relabeled_meta.row.should.equal(7)
        relabeled_meta.custom.should.equal('anything')
        // the source keys keep their own zone and column
        relabeled.matrix_c.meta.mirror.mirror.should.equal('inert')
        relabeled.matrix_c.meta.zone.name.should.equal('matrix')
        relabeled.matrix_c.meta.col.name.should.equal('c')

        // names that read as numbers or math constants stay plain names, with global or zone mirroring
        const numeric = (await ergogen.process({
            'points.mirror': 100,
            'points.zones': {
                1: {columns: {1: {}, e: {}}},
                e: {mirror: 50, columns: {pi: {}}}
            }
        })).points
        Object.keys(numeric).should.have.members(['1_1', '1_e', 'e_pi', 'mirror_e_pi', 'mirror_1_1', 'mirror_1_e'])
        numeric.mirror_1_1.meta.zone.name.should.equal('1')
        numeric.mirror_1_e.meta.col.name.should.equal('e')
        numeric.mirror_e_pi.meta.zone.name.should.equal('e')
        numeric.mirror_e_pi.meta.col.name.should.equal('pi')

        // and so do numeric relabels
        const renumbered = (await ergogen.process({
            ...mirrored, 'points.key.mirror': {zone: {name: 5}, col: {name: 7}}
        })).points
        renumbered.mirror_matrix_c.meta.zone.name.should.equal(5)
        renumbered.mirror_matrix_c.meta.col.name.should.equal(7)
    })

    it('engine', async function() {
        return Promise.all([
            ergogen.process({'meta.engine': 'invalid'}).should.be.rejectedWith('Invalid'),
            ergogen.process({'meta.engine': '0.1.2'}).should.be.rejectedWith('satisfy'),
            // no "points clause" means we're over the engine check, so it "succeeded"
            ergogen.process({'meta.engine': `${version}`}).should.be.rejectedWith('points clause')
        ])
    })

    it('svg', async function() {
        const result_svg = await ergogen.process(medium, {svg: true})
        result_svg.should.have.nested.property('outlines.export.svg')
        const result_no_svg = await ergogen.process(medium, {svg: false})
        result_no_svg.should.not.have.nested.property('outlines.export.svg')
    })
})