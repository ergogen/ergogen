const webui_version = '1.3.0'

//
// ZIP helper
//

const zipup = results => {
    const zip = new JSZip()

    if (debug) {
        const zip_source = zip.folder('source')
        zip_source.file('raw.txt', results.raw)
        zip_source.file('canonical.yaml', jsyaml.dump(results.canonical, {indent: 4}))
    }

    if (debug) {
        const zip_points = zip.folder('points')
        zip_points.file('demo.dxf', results.demo.dxf)
        zip_points.file('demo.svg', results.demo.svg)
        zip_points.file('demo.yaml', jsyaml.dump(results.demo.yaml, {indent: 4}))
        zip_points.file('points.yaml', jsyaml.dump(results.points, {indent: 4}))
        zip_points.file('units.yaml', jsyaml.dump(results.units, {indent: 4}))
    }

    const zip_outlines = zip.folder('outlines')
    for (const [name, outline] of Object.entries(results.outlines)) {
        zip_outlines.file(`${name}.dxf`, outline.dxf)
        zip_outlines.file(`${name}.svg`, outline.svg)
        zip_outlines.file(`${name}.yaml`, jsyaml.dump(outline.yaml, {indent: 4}))
    }
    
    const zip_cases = zip.folder('cases')
    for (const [case_name, _case] of Object.entries(results.cases)) {
        zip_cases.file(`${case_name}.stl`, _case.stl)
        zip_cases.file(`${case_name}.jscad`, _case.jscad)
    }

    const zip_pcbs = zip.folder('pcbs')
    for (const [pcb_name, pcb_text] of Object.entries(results.pcbs)) {
        zip_pcbs.file(`${pcb_name}.kicad_pcb`, pcb_text)
    }

    zip.generateAsync({type: 'blob'}).then(function(content) {
        saveAs(content, 'ergogen.zip')
    })
}

//
// Display helpers
//

const msg = (type, text) => $(`
    <div class="bg-${type} colorchange-${type} rounded">
        ${text}
    </div>
`)

const make_table = () => {
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
    `)
    return [t, t.find('tbody')]
}

let autoview = null
let debug = true

const make_row = (category, name, ext, value, callback, preview_suffix='') => {
    const check = autoview == `${category}.${name}`
    const $row = $(`
        <tr>
            <td>${category}</td>
            <td>${name}</td>
            <td>${ext}</td>
            <td>
                <button type="button" class="btn btn-success preview" data-name="${category}.${name}" title="Preview ${name}.${ext}${preview_suffix}!"><i class="far fa-eye"></i></button>
                <button type="button" class="btn btn-success download" title="Download ${name}.${ext}!"><i class="fas fa-download"></i></button>
                <button type="button" class="btn ${check ? 'btn-success' : 'btn-outline-success'} autoview" data-name="${category}.${name}" title="Automatically preview ${name}.${ext} on the next reload!"><i class="fas fa-sync-alt"></i></button>
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
        const had_it = $(this).hasClass('btn-success')
        $('button.autoview').removeClass('btn-success').addClass('btn-outline-success')
        autoview = null
        if (!had_it) {
            $(this).removeClass('btn-outline-success').addClass('btn-success')
            autoview = $(this).data('name')
        }
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
let panzoom = null
const svg_callback = svg_text => _ => {

    // cleaning up potential old stuff
    const $viewer = $('#svg-viewer')
    $viewer.empty()
    if (panzoom) {
        panzoom.destroy()
    }

    // creating new stuff
    const svg = SVG(svg_text).addTo($viewer[0])
    // add some padding so we don't cut at the border
    const vbox = svg.viewbox()
    svg.viewbox(vbox.x - 5, vbox.y - 5, vbox.w + 10, vbox.h + 10)
    const $svg = $viewer.find('svg')
    panzoom = Panzoom($svg[0], {
        canvas: true
    })

    // enabling zoom
    $viewer.on('wheel', event => {
        panzoom.zoomWithWheel(event.originalEvent, {
            maxScale: 10
        })
    })

    // showing the viewer
    $('div.swap').addClass('d-none')
    $('#back-link').removeClass('d-none')
    $viewer.removeClass('d-none')

    // centering the initial view
    const svg_offset = $svg.offset()
    const svg_x = svg_offset.left + $svg.width() / 2
    const svg_y = svg_offset.top + $svg.height() / 2
    const viewer_offset = $viewer.offset()
    const viewer_x = viewer_offset.left + $viewer.width() / 2
    const viewer_y = viewer_offset.top + $viewer.height() / 2
    setTimeout(function() {
        panzoom.pan(viewer_x - svg_x, viewer_y - svg_y, { relative: true })
    }, 10)

}

let jscad_inited = false
const jscad_callback = val => _ => {
    if (!jscad_inited) {
        window.gProcessor = myjscad.setup()
        jscad_inited = true
    }
    myjscad.load(val, 'placeholder')
    // showing the viewer
    $('div.swap').addClass('d-none')
    $('#back-link').removeClass('d-none')
    const $viewer = $('#jscad-viewer')
    $viewer.removeClass('d-none')
    window.dispatchEvent(new Event('resize'))
}



$(function() {

    // Show versions
    $('#ergogen-version').html(ergogen.version)
    $('#webui-version').html(webui_version)

    // Load examples
    $ex = $('#examples')
    for (const [group, items] of Object.entries(ergogen_examples)) {
        $group = $(`<optgroup label="${group}"></optgroup>`)
        for (const [name, text] of Object.entries(items)) {
            $(`<option data-group="${group}" data-name="${name}">${name}</option>`).appendTo($group)
        }
        $group.appendTo($ex)
    }
    $ex.on('change', function() {
        const o = $(this).find('option:selected')
        const group = o.data('group')
        const name = o.data('name')
        $('#text').val(ergogen_examples[group][name].trim())
    })
    $('#examples').selectpicker()

    // Show intro
    $('#intro-link').click(function() {
        $('div.swap').addClass('d-none')
        $('#intro').removeClass('d-none')
        $('#back-link').removeClass('d-none')
    })
    
    // Back to tool
    $('#back-link').click(function() {
        $('div.swap').addClass('d-none')
        $('#tool').removeClass('d-none')
        $('#back-link').addClass('d-none')
    })
    
    // Push the button
    $('#generate').click(function() {

        const raw = $('#text').val()
        const $res = $('#results')
        const $placeholder = $('#results-placeholder')

        $placeholder.addClass('d-none')
        $res.removeClass('d-none').empty()
        msg('warning', 'Generating...').appendTo($res)

        setTimeout(async function() {

            try {

                const results = await ergogen.process(raw, debug, m => console.log(m))
                console.log('Ergogen processing finished.', results)
                $res.empty()
                const con = ' in the console'

                // by category

                let [$table, $tbody] = make_table()
                let empty_res = true
                make_divider().appendTo($tbody)

                if (debug) {
                    empty_res = false
                    make_row('source', 'raw', 'txt', raw, text_callback, con).appendTo($tbody)
                    make_row('source', 'canonical', 'yaml', jsyaml.dump(results.canonical, {indent: 4}), yaml_callback, con).appendTo($tbody)
                    make_divider().appendTo($tbody)
                
                    make_row('points', 'demo', 'dxf', results.demo.dxf, svg_callback(results.demo.svg)).appendTo($tbody)
                    make_row('points', 'points', 'yaml', jsyaml.dump(results.points, {indent: 4}), yaml_callback, con).appendTo($tbody)
                    make_row('points', 'units', 'yaml', jsyaml.dump(results.units, {indent: 4}), yaml_callback, con).appendTo($tbody)
                    make_divider().appendTo($tbody)
                }
                
                for (const [name, outline] of Object.entries(results.outlines)) {
                    empty_res = false
                    make_row('outlines', name, 'dxf', outline.dxf, svg_callback(outline.svg)).appendTo($tbody)
                }
                if (Object.entries(results.outlines).length) {
                    make_divider().appendTo($tbody)
                }

                for (const [case_name, _case] of Object.entries(results.cases)) {
                    empty_res = false
                    make_row('cases', case_name, 'jscad', _case.stl, jscad_callback(_case.jscad)).appendTo($tbody)
                }
                if (Object.entries(results.cases).length) {
                    make_divider().appendTo($tbody)
                }
                
                for (const [pcb_name, pcb_text] of Object.entries(results.pcbs)) {
                    empty_res = false
                    make_row('pcbs', pcb_name, 'kicad_pcb', pcb_text, text_callback, con).appendTo($tbody)
                }
                
                // everything as a zip

                if (!empty_res) {
                    $table.appendTo($res)
                    $(`
                        <a href="#" id="download-all" class="btn btn-success my-5">Download everything in a ZIP!</a>
                    `).appendTo($res)
    
                    $('#download-all').click(function() {
                        zipup(results)
                    })

                    // automatic preview
                    if (autoview) {
                        $(`button.preview[data-name='${autoview}']`).click()
                    }
                } else {
                    const suffix = debug ? '' : ' Maybe in debug mode?'
                    msg('info', 'The results are empty!' + suffix).appendTo($res)
                }


                console.log('Done.')

            } catch (ex) {
                console.log(ex)
                $res.empty()
                msg('danger', ex).appendTo($res)
            }
        }, 10)
    })

    $('#debug').click(function() {
        debug = !debug
        if (debug) {
            $(this).removeClass('btn-outline-success').addClass('btn-success')
        } else {
            $(this).removeClass('btn-success').addClass('btn-outline-success')
        }
    })
})