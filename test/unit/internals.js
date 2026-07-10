const m = require('makerjs')
const kicad5 = require('../../src/templates/kicad5')
const kicad8 = require('../../src/templates/kicad8')
const ergogen = require('../../src/ergogen')
const io = require('../../src/io')

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

    it('should allow injecting outlines', async function() {
        const injected = (config, name, points, outlines, units) => {
            return [() => {
                const shape = new m.models.Rectangle(10, 10)
                const bbox = m.measure.modelExtents(shape)
                return [shape, {low: bbox.low, high: bbox.high}]
            }, units]
        }
        ergogen.inject('outline', 'my_injected', injected)

        const config = {
            points: {
                zones: {
                    matrix: {
                        columns: {
                            pos: {
                                key: { x: 0, y: 0 }
                            }
                        }
                    }
                }
            },
            outlines: {
                test: [
                    { what: 'my_injected' }
                ]
            }
        }

        const result = await ergogen.process(config)
        result.outlines.test.should.exist
    })

    it('should allow injecting footprints', async function() {
        const footprint = {
            params: {},
            body: () => 'custom-footprint-body'
        }
        ergogen.inject('footprint', 'my_custom_footprint', footprint)

        const config = {
            points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } },
            outlines: {
                box: [
                    { what: 'rectangle', size: 20 }
                ]
            },
            pcbs: {
                board: {
                    outlines: { board: { outline: 'box' } },
                    footprints: [
                        { what: 'my_custom_footprint', where: true }
                    ]
                }
            }
        }

        const result = await ergogen.process(config)
        result.pcbs.board.should.contain('custom-footprint-body')
    })

    it('should allow injecting templates', async function() {
        const template = {
            convert_outline: () => {},
            body: () => 'custom-template-body'
        }
        ergogen.inject('template', 'my_custom_template', template)

        const config = {
            points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } },
            outlines: {
                box: [
                    { what: 'rectangle', size: 20 }
                ]
            },
            pcbs: {
                board: {
                    template: 'my_custom_template',
                    outlines: { board: { outline: 'box' } }
                }
            }
        }

        const result = await ergogen.process(config)
        result.pcbs.board.should.equal('custom-template-body')
    })

    it('should default to footprint injection when using the 2-argument signature', async function() {
        const footprint = {
            params: {},
            body: () => 'shorthand-footprint-body'
        }
        // Utilizing the 2-argument overload: (name, value) => defaults to 'footprint'
        ergogen.inject('shorthand_footprint', footprint)

        const config = {
            points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } },
            outlines: {
                box: [
                    { what: 'rectangle', size: 20 }
                ]
            },
            pcbs: {
                board: {
                    outlines: { board: { outline: 'box' } },
                    footprints: [
                        { what: 'shorthand_footprint', where: true }
                    ]
                }
            }
        }

        const result = await ergogen.process(config)
        result.pcbs.board.should.contain('shorthand-footprint-body')
    })

    it('should overwrite existing injections on duplicate register calls', async function() {
        const first_footprint = {
            params: {},
            body: () => 'first-footprint-body'
        }
        const second_footprint = {
            params: {},
            body: () => 'second-footprint-body'
        }
        ergogen.inject('footprint', 'overwrite_footprint', first_footprint)
        ergogen.inject('footprint', 'overwrite_footprint', second_footprint)

        const config = {
            points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } },
            outlines: {
                box: [
                    { what: 'rectangle', size: 20 }
                ]
            },
            pcbs: {
                board: {
                    outlines: { board: { outline: 'box' } },
                    footprints: [
                        { what: 'overwrite_footprint', where: true }
                    ]
                }
            }
        }

        const result = await ergogen.process(config)
        result.pcbs.board.should.contain('second-footprint-body')
        result.pcbs.board.should.not.contain('first-footprint-body')
    })
})

describe('IO', function() {
    it('should unpack outlines from zip with multiple paths, mirroring, and JS outlines', async function() {
        const mockZip = {
            file: function(regex) {
                if (regex.toString().includes('config')) {
                    return [{ async: () => Promise.resolve('points: { zones: { matrix: { columns: { pos: { key: { x: 0, y: 0 } } } } } }') }]
                }
                return []
            },
            folder: function(name) {
                if (name === 'outlines') {
                    return {
                        file: function(regex) {
                            return [
                                {
                                    name: 'outlines/test.svg',
                                    async: () => Promise.resolve('<svg><path d="M 0 0 L 10 0 L 10 10 Z" /><path d="M 20 20 L 30 20 L 30 30 Z" /></svg>')
                                },
                                {
                                    name: 'outlines/testjs.js',
                                    async: () => Promise.resolve('module.exports = (config, name, points, outlines, units) => [() => [{}, {low: [0,0], high: [10,10]}], units]')
                                }
                            ]
                        }
                    }
                }
                return { file: () => [] }
            }
        }

        const [config, injections] = await io.unpack(mockZip)
        injections.should.have.lengthOf(2)
        
        // SVG outline assertion
        injections[0][0].should.equal('outline')
        injections[0][1].should.equal('test')

        // JS outline assertion
        injections[1][0].should.equal('outline')
        injections[1][1].should.equal('testjs')

        // Verify the SVG outline injected function works with multiple paths
        const shapeMaker = injections[0][2]
        const [maker, units] = shapeMaker({}, 'test', {}, {}, {})

        // Test non-mirrored
        const [shape, bbox] = maker({ meta: { mirrored: false } })
        shape.should.exist

        // Test mirrored (covers io.js:81)
        const [mirroredShape, mirroredBbox] = maker({ meta: { mirrored: true } })
        mirroredShape.should.exist
        
        // Verify the JS outline injected function works
        const jsShapeMaker = injections[1][2]
        const [jsMaker, jsUnits] = jsShapeMaker({}, 'testjs', {}, {}, {})
        const [jsShape, jsBbox] = jsMaker({ meta: {} })
        jsShape.should.exist
    })
})
