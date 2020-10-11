//
// Generator stuff
//

const deepcopy = input => JSON.parse(JSON.stringify(input))

const dxf = model => {
    const assembly = makerjs.model.originate({
        models: {
            export: deepcopy(model)
        },
        units: 'mm'
    })
    return makerjs.exporter.toDXF(assembly)
}

const generate = raw => {

    console.log('Interpreting the input...')
    let input
    try {
        input = jsyaml.safeLoad(raw)
        console.log('YAML input format detected.')
    } catch (yamlex) {
        try {
            input = JSON.parse(raw)
            console.log('JSON input format detected.')
        } catch (jsonex) {
            try {
                input = new Function(raw)()
                console.log('JS code input format detected.')
            } catch (codeex) {
                console.log('YAML exception:', yamlex)
                console.log('JSON exception:', jsonex)
                console.log('Code exception:', codeex)
                throw new Error('Input is not valid YAML, JSON, or JS code!')
            }
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


    return {
        raw,
        canonical: input,
        points,
        outlines,
        pcbs,
        cases
    }
}

const zipup = results => {
    const zip = new JSZip()
    const zip_source = zip.folder('source')
    zip_source.file('raw.txt', results.raw)
    zip_source.file('canonical.yaml', jsyaml.dump(results.canonical, {indent: 4}))

    const zip_points = zip.folder('points')
    zip_points.file('demo.dxf', dxf(ergogen.points.visualize(results.points)))
    zip_points.file('points.yaml', jsyaml.dump(results.points, {indent: 4}))

    const zip_outlines = zip.folder('outlines')
    for (const [name, outline] of Object.entries(results.outlines)) {
        zip_outlines.file(`${name}.dxf`, dxf(outline))
    }
    
    const zip_pcbs = zip.folder('pcbs')
    for (const [pcb_name, pcb_text] of Object.entries(results.pcbs)) {
        zip_pcbs.file(`${pcb_name}.kicad_pcb`, pcb_text)
    }
    
    const zip_cases = zip.folder('cases')
    for (const [case_name, case_text] of Object.entries(results.cases)) {
        zip_cases.file(`${case_name}.jscad`, case_text)
    }

    zip.generateAsync({type: 'blob'}).then(function(content) {
        saveAs(content, 'ergogen.zip')
    })
}

//
// Display helpers
//

const msg = (type, text) => $(`
    <div class="bg-${type} rounded">
        ${text}
    </div>
`)

const make_table = (container) => {
    const t = $(`
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Name</th>
                    <th scope="col">Extension</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    `).appendTo(container)
    return t.find('tbody')
}

const make_row = (category, name, ext, value, callback) => {
    const $row = $(`
        <tr>
            <td>${category}</td>
            <td>${name}</td>
            <td>${ext}</td>
            <td>
                <button type="button" class="btn btn-success preview"><i class="far fa-eye"></i></button>
                <button type="button" class="btn btn-success download"><i class="fas fa-download"></i></button>
                <button type="button" class="btn btn-outline-success autoview" data-name="${category}.${name}"><i class="fas fa-sync-alt"></i></button>
            </td>
        </tr>
    `)

    $row.find('.preview').click(function() {
        callback(value)
    })

    $row.find('.download').click(function() {
        const blob = new Blob([value], {
            type: "text/plain;charset=utf-8"
        })
        saveAs(blob, `${name}.${ext}`)
    })

    $row.find('.autoview').click(function() {
        $('button.autoview').removeClass('btn-success').addClass('btn-outline-success')
        $(this).removeClass('btn-outline-success').addClass('btn-success')
    })

    return $row
}

const make_divider = () => $(`
    <tr>
        <td colspan="4" class="divider"><hr /></td>
    </tr>
`)

const text_callback = val => console.log(val)
const yaml_callback = val => console.log(jsyaml.load(val))
const svg_callback = val => console.log(val)
const jscad_callback = val => console.log(val)



$(function() {

    // Show/hide intro
    $('#intro-link').click(function() {
        $('#intro').toggleClass('d-none')
        $('#tool').toggleClass('d-none')
    })

    
    // Push the button
    $('#generate').click(function() {

        const raw = $('#text').val()
        const $res = $('#results')

        $res.empty()
        msg('warning', 'Generating...').appendTo($res)

        setTimeout(function() {

            try {

                const results = generate(raw)
                $res.empty()

                // by category

                let $tbody = make_table($res)

                make_row('source', 'raw', 'txt', raw, text_callback).appendTo($tbody)
                make_row('source', 'canonical', 'yaml', jsyaml.dump(results.canonical, {indent: 4}), yaml_callback).appendTo($tbody)
                make_divider().appendTo($tbody)
                
                make_row('points', 'demo', 'dxf', dxf(ergogen.points.visualize(results.points)), svg_callback).appendTo($tbody)
                make_row('points', 'points', 'yaml', jsyaml.dump(results.points, {indent: 4}), yaml_callback).appendTo($tbody)
                make_divider().appendTo($tbody)
                
                for (const [name, outline] of Object.entries(results.outlines)) {
                    make_row('outlines', name, 'dxf', dxf(outline), svg_callback).appendTo($tbody)
                }
                make_divider().appendTo($tbody)
                
                for (const [pcb_name, pcb_text] of Object.entries(results.pcbs)) {
                    make_row('pcbs', pcb_name, 'kicad_pcb', pcb_text, text_callback).appendTo($tbody)
                }
                make_divider().appendTo($tbody)
                
                for (const [case_name, case_text] of Object.entries(results.cases)) {
                    make_row('cases', case_name, 'jscad', case_text, jscad_callback).appendTo($tbody)
                }
                
                // everything as a zip

                $(`
                    <a href="#" id="download-all" class="btn btn-success my-5">Download everything in a ZIP!</a>
                `).appendTo($res)

                $('#download-all').click(function() {
                    zipup(results)
                })

                console.log('Done.')

            } catch (ex) {
                console.log(ex)
                $res.empty()
                msg('danger', ex).appendTo($res)
            }
        }, 1)
    })
})