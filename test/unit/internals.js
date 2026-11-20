const m = require('makerjs')
const kicad5 = require('../../src/templates/kicad5')
const kicad8 = require('../../src/templates/kicad8')
const jszip = require('jszip')
const ergogen = require('../../src/ergogen')
const io = require('../../src/io')
const whats = require('../../src/outlines')._whats

describe('Internals', function() {

    it('pcb outline conversion with kicad5', function() {
        // warn on unknown path type
        sinon.stub(m.model, 'walk').callsFake(function(model, config) {
            config.onPath({pathContext: {type: 'nonexistent'}})
        })
        kicad5.convert_outline.bind(this).should.throw("Can't convert path type")
    })

    it('pcb outline conversion with kicad8', function() {
        // warn on unknown path type
        sinon.stub(m.model, 'walk').callsFake(function(model, config) {
            config.onPath({pathContext: {type: 'nonexistent'}})
        })
        kicad8.convert_outline.bind(this).should.throw("Can't convert path type")
    })

    it('injection', function() {
        // warn on unknown injection type
        ergogen.inject.bind(this, 'nonexistent', 'name', 'value').should.throw('Unknown injection type')
    })

    // a 10x10 square with its corner on the anchor point
    const square_outline = (config, name, points, outlines, units) => {
        return [() => [new m.models.Rectangle(10, 10), {low: [0, 0], high: [10, 10]}], units]
    }
    const outline_config = what => ({
        points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } },
        outlines: { test: [ { what } ] }
    })
    const prototype_names = ['constructor', 'toString', '__proto__']

    it('should replace outline types with later injections', async function() {
        const registry_before = Object.keys(whats)
        const svg_rectangle = outline_config('rectangle')
        svg_rectangle.outlines.test[0].accuracy = 0.001
        // two built-in types, a library outline, and Object.prototype names (which the registry does not inherit)
        const replaced = ['rectangle', 'svg', 'choc_hotswap_socket']
        const originals = replaced.map(what => whats[what])
        for (const what of prototype_names) {
            await ergogen.process(outline_config(what)).should.be.rejectedWith('should be one of')
        }
        try {
            for (const what of [...replaced, ...prototype_names]) {
                const first = sinon.spy(square_outline)
                const second = sinon.spy(square_outline)
                ergogen.inject('outline', what, first)
                ergogen.inject('outline', what, second)
                // the latest injection is used, without any built-in keys
                const result = await ergogen.process(outline_config(what))
                result.outlines.test.dxf.should.exist
                first.called.should.be.false
                second.calledOnce.should.be.true
            }
        } finally {
            for (const [index, what] of replaced.entries()) ergogen.inject('outline', what, originals[index])
            for (const what of prototype_names) delete whats[what]
        }

        // restoring the originals brings back the built-in behavior
        Object.keys(whats).should.deep.equal(registry_before)
        replaced.map(what => whats[what]).should.deep.equal(originals)
        await ergogen.process(svg_rectangle).should.be.rejectedWith('Unexpected key "accuracy"')
    })

    it('should inject bundled outlines with prototype and built-in names', async function() {
        const registry_before = Object.keys(whats)
        const original_rectangle = whats.rectangle
        const zip = new jszip()
        zip.file('config.yaml', [
            'points.zones.matrix.columns.pos.key: {x: 0, y: 0}',
            'outlines.js_test: [{what: constructor}]',
            'outlines.svg_test: [{what: __proto__}]',
            // the built-in rectangle would reject the svg-only "accuracy" key
            'outlines.builtin_test: [{what: rectangle, accuracy: 0.001}]'
        ].join('\n'))
        zip.file('outlines/constructor.js', 'const m = require("makerjs")\nmodule.exports = (config, name, points, outlines, units) => [() => [new m.models.Rectangle(10, 10), {low: [0, 0], high: [10, 10]}], units]')
        zip.file('outlines/__proto__.svg', '<svg><path d="M 0 0 L 10 0 L 10 10 L 0 10 Z" /></svg>')
        zip.file('outlines/rectangle.svg', '<svg><path d="M 0 0 L 10 0 L 10 10 Z" /></svg>')
        const [config_text, injections] = await io.unpack(zip)
        try {
            for (const [type, name, value] of injections) ergogen.inject(type, name, value)
            const result = await ergogen.process(config_text)
            result.outlines.js_test.dxf.should.exist
            result.outlines.svg_test.dxf.should.exist
            result.outlines.builtin_test.dxf.should.exist
        } finally {
            for (const what of prototype_names) delete whats[what]
            ergogen.inject('outline', 'rectangle', original_rectangle)
        }
        Object.keys(whats).should.deep.equal(registry_before)
    })

    it('should overwrite existing injections on duplicate register calls', async function() {
        ergogen.inject('footprint', 'overwrite_footprint', {params: {}, body: () => 'first-footprint-body'})
        ergogen.inject('footprint', 'overwrite_footprint', {params: {}, body: () => 'second-footprint-body'})
        const result = await ergogen.process({
            points: {zones: {matrix: null}},
            outlines: {box: [{what: 'rectangle', size: 20}]},
            pcbs: {board: {outlines: {board: {outline: 'box'}}, footprints: [{what: 'overwrite_footprint', where: true}]}}
        })
        result.pcbs.board.should.contain('second-footprint-body')
        result.pcbs.board.should.not.contain('first-footprint-body')
    })
})



