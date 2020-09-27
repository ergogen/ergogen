$(function() {
    $('#intro-link').click(function() {
        $('#intro').toggleClass('d-none')
        $('#tool').toggleClass('d-none')
    })

    const deepcopy = input => JSON.parse(JSON.stringify(input))

    const dxf = (model) => {
        const assembly = makerjs.model.originate({
            models: {
                export: deepcopy(model)
            },
            units: 'mm'
        })
        return makerjs.exporter.toDXF(assembly)
    }

    $('#generate').click(function() {
        console.log('arst')
        const raw = $('#text').val()
        const $res = $('#results')
        $res.empty()
        try {
            console.log('Interpreting the input...')
            let input
            try {
                input = jsyaml.load(raw)
            } catch (yamlex) {
                try {
                    input = JSON.parse(raw)
                } catch (jsonex) {
                    console.log('yaml exception:', yamlex)
                    console.log('json exception:', jsonex)
                    throw new Error('Input is neither valid YAML, nor valid JSON!')
                }
            }
            if (!input) {
                throw new Error('Input appears to be empty!')
            }
            if (!input.points) {
                throw new Error('Input does not contain any points!')
            }
            console.log('Loaded input:', input)
            console.log('Parsing points...')
            const points = ergogen.points.parse(input.points)
            if (!Object.keys(points).length) {
                throw new Error('No points parsed from input!')
            }
            console.log('Generating outlines...')
            const outlines = ergogen.outlines.parse(input.outlines || {}, points)
            console.log('Scaffolding PCBs...')
            const pcbs = ergogen.pcbs.parse(input.pcbs || {}, points, outlines)
            console.log('Extruding cases...')
            const cases = ergogen.cases.parse(input.cases || {}, outlines)


            console.log('Saving output...')

            const zip = new JSZip()
            const zip_points = zip.folder('points')
            zip_points.file('points_demo.dxf', dxf(ergogen.points.visualize(points)))

            const zip_outlines = zip.folder('outlines')
            for (const [name, outline] of Object.entries(outlines)) {
                zip_outlines.file(`${name}.dxf`, dxf(outline))
            }
            
            const zip_pcbs = zip.folder('pcbs')
            for (const [pcb_name, pcb_text] of Object.entries(pcbs)) {
                zip_pcbs.file(`${pcb_name}.kicad_pcb`, pcb_text)
            }
            
            const zip_cases = zip.folder('cases')
            for (const [case_name, case_text] of Object.entries(cases)) {
                zip_cases.file(`${case_name}.jscad`, case_text)
            }

            zip.generateAsync({type:"blob"}).then(function(content) {
                $(`
                    <div class="bg-success my-2">
                        All zipped up and ready to go!
                    </div>
                    <a href="#" id="dl" class="btn btn-success mb-5">Download!</a>
                `).appendTo($res)
                $('#dl').click(function() {
                    saveAs(content, "ergogen.zip")
                })
                console.log('Done.')
            })

        } catch (ex) {
            console.log(ex)
            $(`
                <div class="bg-danger my-2">
                    ${ex}
                </div>
            `).appendTo($res)
        }
    })
})