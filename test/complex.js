const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const points_lib = require('../src/points')

const fixtures = path.join(__dirname, 'fixtures')
const absolem_config = yaml.load(fs.readFileSync(path.join(fixtures, 'absolem.yaml')).toString())

describe('Absolem', function() {
    it('#points', function() {
        const expected = fs.readJSONSync(path.join(fixtures, 'absolem_points.json'))
        const actual = points_lib.parse(absolem_config.points)
        // remove metadata, so that it only checks the points
        Object.values(actual).map(val => delete val.meta)
        actual.should.deep.equal(expected)
    })
})