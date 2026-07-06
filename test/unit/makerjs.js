const m = require('makerjs')
const {fixture} = require('../helpers/fixture')

describe('MakerJS', function() {

    it('disappearance', function() {
        // test combination disappearance, as per https://github.com/microsoft/maker.js/issues/465
        const disappear = fixture('makerjs/bug_465_disappear.json')
        const combined = m.model.combineUnion(disappear.models.a, disappear.models.b)
        const ref = fixture('makerjs/bug_465_disappear_good.dxf')
        m.exporter.toDXF(combined).should.equal(ref)
    })

    it('weird combination', function() {
        // test second weird combination, again in https://github.com/microsoft/maker.js/issues/465
        // this isn't fixed by default yet, needs custom farPoint to work properly
        const base = new m.models.RoundRectangle(10, 10, 1)
        const a = m.model.move(new m.models.Rectangle(10, 10), [5, 5])
        const b = m.model.move(new m.models.Rectangle(10, 10), [5, -5])
        const base_plus_a = m.model.combineUnion(base, a)
        
        const {farPoint, deepcopy} = require('../../src/utils')

        const bad = m.model.combineUnion(deepcopy(base_plus_a), deepcopy(b))
        const bad_ref = fixture('makerjs/bug_465_weird_bad.dxf')
        m.exporter.toDXF(bad).should.equal(bad_ref)
        
        const good = m.model.combine(deepcopy(base_plus_a), deepcopy(b), false, true, false, true, {farPoint})
        const good_ref = fixture('makerjs/bug_465_weird_good.dxf')
        m.exporter.toDXF(good).should.equal(good_ref)
    })
})



