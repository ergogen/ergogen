const m = require('makerjs')
const pcb_lib = require('../../src/pcbs')
const ergogen = require('../../src/ergogen')

describe('Internals', function() {

    it('makerjs2kicad', function() {
        // warn on unknown path type
        sinon.stub(m.model, 'walk').callsFake(function(model, config) {
            config.onPath({pathContext: {type: 'nonexistent'}})
        })
        pcb_lib._makerjs2kicad.bind(this).should.throw("Can't convert path type")
    })

    it('injection', function() {
        // warn on unknown injection type
        ergogen.inject.bind(this, 'nonexistent', 'name', 'value').should.throw('Unknown injection type')
    })
})



