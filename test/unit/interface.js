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