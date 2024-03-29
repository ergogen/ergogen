const m = require('makerjs')
const kicad5 = require('../../src/templates/kicad5')
const ergogen = require('../../src/ergogen')

describe('Internals', function() {

    it('pcb outline conversion', function() {
        // warn on unknown path type
        sinon.stub(m.model, 'walk').callsFake(function(model, config) {
            config.onPath({pathContext: {type: 'nonexistent'}})
        })
        kicad5.convert_outline.bind(this).should.throw("Can't convert path type")
    })

    it('injection', function() {
        // warn on unknown injection type
        ergogen.inject.bind(this, 'nonexistent', 'name', 'value').should.throw('Unknown injection type')
    })
})



