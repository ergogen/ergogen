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

    it('minimal', async function() {
        underscore(await ergogen.process(minimal)).should.be.false
    })

    it('production', async function() {
        underscore(await ergogen.process(full, false)).should.be.false
    })
    
    it('debug', async function() {
        underscore(await ergogen.process(full, true)).should.be.true
    })

    it('logging', async function() {
        const flag = {value: false}
        const logger = msg => { flag.value = true }
        await ergogen.process(full, false, logger)
        flag.value.should.be.true
    })

})