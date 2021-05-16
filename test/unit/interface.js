const u = require('../../src/utils')
const ergogen = require('../../src/ergogen')

const minimal = {
    'points.zones.matrix': {
        columns: {col: {}},
        rows: {row: {}}
    }
}

const full = {
    'points.zones.matrix': {
        columns: {col: {}},
        rows: {row: {}}
    },
    'outlines.exports': {
        export: [{
            type: 'keys',
            side: 'left',
            size: 18
        }],
        _export: [{
            type: 'keys',
            side: 'left',
            size: 18
        }]
    },
    cases: {
        export: [{
            name: 'export',
            extrude: 1
        }],
        _export: [{
            name: 'export',
            extrude: 1
        }]
    },
    pcbs: {
        export: {},
        _export: {}
    }
}

// to check whether the output has "private" exports
const underscore = obj => {
    for (const val of Object.values(obj)) {
        for (const key of Object.keys(val)) {
            if (key.startsWith('_')) return true
        }
    }
    return false
}


describe('Interface', function() {

    it('minimal', function() {
        underscore(ergogen.process(minimal)).should.be.false
    })

    it('production', function() {
        underscore(ergogen.process(full, false)).should.be.false
    })
    
    it('debug', function() {
        underscore(ergogen.process(full, true)).should.be.true
    })

    it('logging', function() {
        const flag = {value: false}
        const logger = msg => { flag.value = true }
        ergogen.process(full, false, logger)
        flag.value.should.be.true
    })

})