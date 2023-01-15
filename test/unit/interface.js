const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const ergogen = require('../../src/ergogen')
const version = require('../../package.json').version

// fixtures
const load = name => yaml.safeLoad(fs.readFileSync(
    path.join(__dirname, `../fixtures/${name}`)
).toString())
const minimal = load('minimal.yaml')
const big = load('big.yaml')
const minimal_kle = load('minimal_kle.json')
const atreus_kle = load('atreus_kle.json')

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
        underscore(await ergogen.process(big, false)).should.be.false
        underscore(await ergogen.process(big, true)).should.be.true
    })

    it('formats', async function() {
        const logger = msg => {
            if (msg.startsWith('Interpreting format:')) {
                throw msg.split(':')[1].trim()
            }
        }
        return Promise.all([
            ergogen.process(minimal, true, logger).should.be.rejectedWith('OBJ'),
            ergogen.process(yaml.dump(minimal), true, logger).should.be.rejectedWith('YAML'),
            ergogen.process(`
                //:
                return {points: {}}
            `, true, logger).should.be.rejectedWith('JS'),
            ergogen.process(`
                //:
                return 'not an object';
            `, true, logger).should.be.rejectedWith('not valid'),
            ergogen.process(minimal_kle, true, logger).should.be.rejectedWith('KLE'),
            ergogen.process(atreus_kle, true, logger).should.be.rejectedWith('KLE'),
            ergogen.process('not an object', true, logger).should.be.rejectedWith('object'),
            ergogen.process({}, true, logger).should.be.rejectedWith('empty'),
            ergogen.process({not_points: {}}, true, () => {}).should.be.rejectedWith('points clause'),
            ergogen.process({points: {zones: {}}}, true, () => {}).should.be.rejectedWith('any points')
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
    
})