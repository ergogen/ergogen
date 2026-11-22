const m = require('makerjs')
const u = require('./utils')
const a = require('./assert')

// path extraction for SVG outlines, shared by bundle loading (io.js) and the rollup build,
// and the outline factory that inline, bundled, built and library svg outlines all go through
//
// this is an importer for the "d" attributes of paths, not an svg renderer, and only a path-data subset of SVG is supported:
//  - the "d" data of every rendered <path> becomes an outline path, in millimetres
//  - without a viewBox, one path unit is 1mm, and width/height never rescale paths
//  - width/height must be positive, either unitless or in mm
//  - a viewBox must start at 0 0, and must match width/height (if present) up to `tolerance`
//  - comments, foreign (e.g. inkscape) elements and unreferenced defs/clipPath/etc. are ignored
//  - other visible geometry, transforms, clipping, masking, markers, filters and nested viewports are rejected
//  - path data has to follow the svg path grammar, and is passed on with its tokens separated
//  - css never selects or expands paths: style elements (stylesheets) are not read at all, so their rules
//    (transforms included) are ignored, and paths that css or attributes like display, visibility, stroke or fill
//    would hide are still imported
//  - every inline style declaration is checked for exactly the transform, rotate, scale, translate, clip-path, mask,
//    marker(-start/-mid/-end) and filter properties (this list is fixed), without a cascade, and comments, escapes or
//    rule blocks ("@x{}") in inline styles are rejected, as they could hide a property name or a declaration boundary
//  - other css properties (like "d", mask-image or offset-path) are not interpreted
//
// it reads its input as trusted design data, and is not a sandbox for arbitrary hostile svg:
//  - nothing is fetched, and no entities are expanded besides the five predefined ones and character references
//  - the imported path geometry is built by makerjs without any limit on its size, coordinates or curve complexity

const svg_namespace = 'http://www.w3.org/2000/svg'

// relative difference allowed between root width/height and the viewBox, for decimal roundoff
const tolerance = exports.tolerance = 1e-4

// visible geometry that is not path data, and that would otherwise silently go missing
const shapes = ['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'image', 'use']
// containers that are only rendered when referenced
const definitions = ['defs', 'clipPath', 'mask', 'pattern', 'marker', 'symbol', 'linearGradient', 'radialGradient', 'filter']
// elements without geometry
const descriptions = ['title', 'desc', 'metadata', 'style', 'script']
const containers = ['g', 'a']

const xml_name = '[A-Za-z_][\\w.\\-]*(?::[A-Za-z_][\\w.\\-]*)?'
const attribute_regex = new RegExp(`(${xml_name})\\s*=\\s*(?:"([^"<]*)"|'([^'<]*)')`, 'g')
const start_tag_regex = new RegExp(`<(${xml_name})((?:\\s+${xml_name}\\s*=\\s*(?:"[^"<]*"|'[^'<]*'))*)\\s*(\\/?)>`, 'y')
const end_tag_regex = new RegExp(`<\\/(${xml_name})\\s*>`, 'y')
const doctype_regex = /<!DOCTYPE[^<>\[\]]*>/y
// the svg number grammar, shared by root attributes and path data (the dot and the fraction are optional
// together, so a failed match cannot retry every split of a long run of digits, which took quadratic time)
const number_source = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?'
const number_regex = new RegExp(`^${number_source}$`)
const length_regex = new RegExp(`^\\s*(${number_source})(mm)?\\s*$`)

// maps keyed by svg input never inherit (e.g. "constructor") from Object.prototype
const own = (fields={}) => Object.assign(Object.create(null), fields)
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
const no_namespaces = Object.freeze(own())

const entities = own({lt: '<', gt: '>', amp: '&', quot: '"', apos: '\''})

// css properties that transform an element
const transforms = ['transform', 'rotate', 'scale', 'translate']
// references to definitions that would change the imported geometry, and what to do about them
const references = {
    'clip-path': 'clipping and masking are not supported! Apply them to the paths before exporting.',
    'mask': 'clipping and masking are not supported! Apply them to the paths before exporting.',
    'marker': 'markers are not supported! Convert the markers to paths before exporting.',
    'marker-start': 'markers are not supported! Convert the markers to paths before exporting.',
    'marker-mid': 'markers are not supported! Convert the markers to paths before exporting.',
    'marker-end': 'markers are not supported! Convert the markers to paths before exporting.',
    'filter': 'filters are not supported! Remove them before exporting.',
}

// path data commands, and the number of arguments in each of their segments
const path_commands = {m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0}
const path_space = ' \t\n\f\r'
const path_number_regex = new RegExp(number_source, 'y')
const path_flag_regex = /[01]/y

// makerjs centers an arc on one of its endpoints when they nearly coincide, leaving a stray zero-span arc or a misplaced
// circle, as it takes the circles of the arc's radius around them (after undoing the rotation and the ellipse ratio)
// within 0.0001 of each other for the same circle, unless the radius is too small to need them (its own calculation)
const unplaceable_arc = (from, to, rx, ry, rotation) => {
    // makerjs coordinates have y pointing up
    const origin = [from[0], -from[1]]
    let chord = new m.paths.Line(origin, m.point.rotate([to[0], -to[1]], rotation, origin))
    if (rx !== ry) chord = m.path.distort(chord, 1, rx / ry)
    return m.measure.isPointEqual(chord.origin, chord.end, 0.0001) && m.round(rx - m.measure.pointDistance(chord.origin, chord.end) / 2) > 0
}

// validates path data against the svg path grammar, and returns it with its tokens separated by spaces
// (makerjs would silently skip unknown commands, read missing arguments as NaN, hang on some truncated
// curves, and split valid compact forms like the arc flags in "0 018.6" or the number "05" differently)
// arc segments with a zero radius or coinciding endpoints become lines, as the svg spec says they should
// (makerjs would bulge, fail or leave a zero-span arc on them instead), while later smooth curves stay unaffected
// arcs with nearly, but not exactly, coinciding endpoints are rejected, as they can be float noise around a left out
// arc or a deliberate (almost) full ellipse, and makerjs would import neither of them correctly
const path_data = exports.path_data = (data, label) => {
    const fail = reason => {
        throw new Error(`${label} has invalid path data, ${reason}!`)
    }
    const tokens = []
    let pos = 0
    const skip = () => {
        while (pos < data.length && path_space.includes(data[pos])) pos++
    }
    // the next argument of a command (with an optional comma before all but the first), if there is one
    const argument = (command, index, first) => {
        const start = pos
        skip()
        const comma = !first && data[pos] == ','
        if (comma) {
            pos++
            skip()
        }
        const flag = command == 'a' && (index == 3 || index == 4)
        const regex = flag ? path_flag_regex : path_number_regex
        regex.lastIndex = pos
        const match = regex.exec(data)
        if (!match) {
            if (comma) fail(`expected ${flag ? 'a flag' : 'a number'} after the comma at offset ${pos}`)
            pos = start
            return undefined
        }
        const value = parseFloat(match[0])
        if (!Number.isFinite(value)) fail(`the number "${match[0]}" at offset ${pos} is not finite`)
        if (command == 'a' && index < 2 && value < 0) fail(`the arc radius "${match[0]}" at offset ${pos} is negative`)
        pos = regex.lastIndex
        return Object.is(value, -0) ? '-0' : String(value)
    }
    // the current point and the start of its subpath (in path units), to recognize coinciding arc endpoints
    let current = [0, 0]
    let subpath = [0, 0]
    skip()
    while (pos < data.length) {
        const start = pos
        const letter = data[pos]
        const command = letter.toLowerCase()
        if (!has(path_commands, command)) fail(`unexpected "${letter}" at offset ${pos}`)
        if (!tokens.length && command != 'm') fail(`it should start with a moveto ("M" or "m"), not "${letter}"`)
        const arity = path_commands[command]
        const relative = letter == command
        let emitted = undefined
        // makerjs only reads the first argument of "H" and "V", so every further one gets its own command
        const emit = (key, values) => {
            if (key != emitted || arity == 1) tokens.push(key)
            emitted = key
            tokens.push(...values)
        }
        if (!arity) {
            tokens.push(letter)
            current = subpath
        }
        pos++
        let count = 0
        let segment = []
        while (arity) {
            const value = argument(command, segment.length, count === 0)
            if (value === undefined) break
            segment.push(value)
            count++
            if (segment.length < arity) continue
            const values = segment.map(Number)
            const origin = relative ? current : [0, 0]
            const end = command == 'h' ? [origin[0] + values[0], current[1]]
                : command == 'v' ? [current[0], origin[1] + values[0]]
                : [origin[0] + values[arity - 2], origin[1] + values[arity - 1]]
            if (command == 'm' && count == arity) subpath = end
            const degenerate = command == 'a' && (values[0] === 0 || values[1] === 0 || (end[0] === current[0] && end[1] === current[1]))
            if (degenerate) emit(relative ? 'l' : 'L', segment.slice(-2))
            else {
                if (command == 'a' && unplaceable_arc(current, end, values[0], values[1], values[2])) {
                    throw new Error(`${label} has an arc to "${segment[5]} ${segment[6]}" in the command "${letter}" at offset ${start}, ` +
                        'whose endpoints nearly coincide, which is not supported! Make them identical to leave the arc out, or move them further apart.')
                }
                emit(letter, segment)
            }
            current = end
            segment = []
        }
        if (arity && (!count || count % arity)) fail(`the command "${letter}" at offset ${start} takes ${arity} argument${arity == 1 ? '' : 's'} per segment, not ${count}`)
        skip()
    }
    if (!tokens.length) fail('it should start with a moveto ("M" or "m")')
    return tokens.join(' ')
}

const decode = (raw, name) => raw.replace(/&(?:#x([0-9a-fA-F]+)|#([0-9]+)|([A-Za-z]+))?;?/g, (match, hex, dec, entity) => {
    a.assert(match.length > 1 && match.endsWith(';'), `SVG outline "${name}" contains a malformed entity "${match}"!`)
    if (entity !== undefined) {
        a.assert(has(entities, entity), `SVG outline "${name}" contains an unknown entity "${match}"!`)
        return entities[entity]
    }
    const code = hex !== undefined ? parseInt(hex, 16) : parseInt(dec, 10)
    a.assert(code <= 0x10FFFF, `SVG outline "${name}" contains an invalid character reference "${match}"!`)
    return String.fromCodePoint(code)
})

const parse_attributes = (raw, name) => {
    const attributes = own()
    for (const [, key, double, single] of raw.matchAll(attribute_regex)) {
        a.assert(!has(attributes, key), `SVG outline "${name}" repeats the attribute "${key}" on an element!`)
        attributes[key] = decode(double !== undefined ? double : single, name)
    }
    return attributes
}

// every declaration of an inline style attribute, as [property, value] pairs (vendor prefixes and
// "!important" removed), so that no later, duplicate or less important declaration can hide another one
// (anything that would need a css tokenizer to split into declarations is rejected instead)
const style_declarations = (style, qname, name) => {
    if (style === undefined) return []
    a.assert(!/\/\*|[\\@{}]/.test(style), `SVG outline "${name}" has a comment, an escape or a rule block in the style of <${qname}>, ` +
        'which is not supported! Remove it from the style before exporting.')
    const declarations = []
    for (const declaration of style.split(';')) {
        const colon = declaration.indexOf(':')
        if (colon == -1) continue
        const property = declaration.slice(0, colon).trim().toLowerCase().replace(/^-(?:webkit|moz|ms|o)-/, '')
        declarations.push([property, declaration.slice(colon + 1).replace(/!\s*important\s*$/i, '')])
    }
    return declarations
}

const active = value => value !== undefined && value.trim() !== '' && value.trim() != 'none'

const positive_length = (raw, field, name) => {
    const match = length_regex.exec(raw)
    const value = match ? parseFloat(match[1]) : NaN
    a.assert(Number.isFinite(value) && value > 0, `Field "${field}" of SVG outline "${name}" should be a positive length in mm (or unitless mm), not "${raw}"! ` +
        'Export the SVG in millimetres so that one path unit is 1mm.')
    return value
}

const check_root = (attributes, name) => {
    for (const field of ['x', 'y']) {
        if (attributes[field] === undefined) continue
        a.assert(number_regex.test(attributes[field].trim()) && parseFloat(attributes[field]) === 0,
            `Field "${field}" of SVG outline "${name}" should be 0, offset root viewports are not supported!`)
    }
    const dimensions = {}
    for (const field of ['width', 'height']) {
        if (attributes[field] === undefined) continue
        dimensions[field] = positive_length(attributes[field], field, name)
    }
    if (attributes.viewBox === undefined) return
    const raw = attributes.viewBox
    const values = raw.trim().split(/\s*,\s*|\s+/).map(part => number_regex.test(part) ? parseFloat(part) : NaN)
    a.assert(values.length == 4 && values.every(Number.isFinite),
        `Field "viewBox" of SVG outline "${name}" should be four finite numbers, not "${raw}"!`)
    const [min_x, min_y, width, height] = values
    a.assert(min_x === 0 && min_y === 0, `Field "viewBox" of SVG outline "${name}" should start at "0 0", not "${raw}"! ` +
        'Move the drawing to the origin of the page before exporting.')
    a.assert(width > 0 && height > 0, `Field "viewBox" of SVG outline "${name}" should have a positive width and height, not "${raw}"!`)
    for (const [field, extent] of Object.entries({width, height})) {
        if (dimensions[field] === undefined) continue
        const difference = Math.abs(dimensions[field] - extent) / Math.max(dimensions[field], extent)
        a.assert(difference <= tolerance, `Field "${field}" of SVG outline "${name}" (${attributes[field]}) does not match the viewBox ${field} (${extent}), ` +
            'scaled viewBoxes are not supported! Make one user unit equal 1mm before exporting.')
    }
}

// the namespace bindings of an element: its parent's table, or a copy of it when the element declares namespaces
// (tables are never changed once made, so most elements share them instead of copying every binding)
const scope_namespaces = (attributes, inherited) => {
    let namespaces = inherited
    for (const [key, val] of Object.entries(attributes)) {
        if (key != 'xmlns' && !key.startsWith('xmlns:')) continue
        if (namespaces === inherited) namespaces = own(inherited)
        namespaces[key == 'xmlns' ? '' : key.slice('xmlns:'.length)] = val
    }
    return namespaces
}

// the namespace of an element name (`undefined` means an unprefixed name without a default namespace)
const namespace_of = (qname, namespaces, name) => {
    const colon = qname.indexOf(':')
    if (colon == -1) return namespaces['']
    const prefix = qname.slice(0, colon)
    a.assert(has(namespaces, prefix), `SVG outline "${name}" uses the undeclared namespace prefix "${prefix}"!`)
    return namespaces[prefix]
}

exports.extract = (text, name) => {

    a.assert(typeof text == 'string', `SVG outline "${name}" should be text!`)
    if (text.startsWith('\uFEFF')) text = text.slice(1)

    const paths = []
    const stack = []
    let root_seen = false
    let pos = 0

    // the geometry-relevant state of an element, given its parent's state
    const visit = (qname, attributes) => {
        const parent = stack[stack.length - 1]
        const namespaces = scope_namespaces(attributes, parent ? parent.namespaces : no_namespaces)
        const frame = {qname, namespaces, ignored: false, transformed: undefined}
        const namespace = namespace_of(qname, namespaces, name)
        const local = qname.slice(qname.indexOf(':') + 1)
        const svg = namespace === undefined || namespace == svg_namespace

        if (!parent) {
            a.assert(!root_seen, `SVG outline "${name}" has more than one root element!`)
            a.assert(svg && local == 'svg', `SVG outline "${name}" should have an <svg> root element, not <${qname}>!`)
            root_seen = true
            check_root(attributes, name)
        } else if (parent.ignored || !svg) {
            // children of unrendered definitions and foreign (e.g. inkscape) elements have no geometry
            frame.ignored = true
            return frame
        }

        if (definitions.includes(local) || descriptions.includes(local)) {
            frame.ignored = true
            return frame
        }
        a.assert(!shapes.includes(local), `SVG outline "${name}" contains a visible <${qname}>, but only paths are supported! ` +
            'Convert objects to paths before exporting.')
        a.assert(parent === undefined || local != 'svg', `SVG outline "${name}" contains a nested <svg> viewport, which is not supported! ` +
            'Flatten the drawing into a single <svg> before exporting.')
        a.assert(local == 'svg' || local == 'path' || containers.includes(local), `SVG outline "${name}" contains an unsupported element <${qname}>!`)

        const declarations = style_declarations(attributes.style, qname, name)
        const styled = property => declarations.some(([key, value]) => key == property && active(value))
        for (const [property, reason] of Object.entries(references)) {
            a.assert(!active(attributes[property]) && !styled(property), `SVG outline "${name}" uses "${property}" on <${qname}>, ${reason}`)
        }
        frame.transformed = parent && parent.transformed
        if (active(attributes.transform) || transforms.some(styled)) frame.transformed = qname

        if (local == 'path') {
            a.assert(frame.transformed === undefined, `SVG outline "${name}" has a transform on <${frame.transformed}> affecting path ${paths.length}, ` +
                'transforms are not supported! Flatten transforms before exporting.')
            a.assert(attributes.d !== undefined, `SVG outline "${name}" has a <path> without "d" data at index ${paths.length}!`)
            path_data(attributes.d, `Path ${paths.length} for SVG outline "${name}"`)
            paths.push(attributes.d)
        }
        return frame
    }

    while (pos < text.length) {
        const next = text.indexOf('<', pos)
        const content = text.slice(pos, next == -1 ? text.length : next)
        a.assert(stack.length || content.trim() === '', `SVG outline "${name}" has text outside of its root element!`)
        if (next == -1) break
        pos = next

        if (text.startsWith('<!--', pos)) {
            const end = text.indexOf('-->', pos + 4)
            a.assert(end != -1, `SVG outline "${name}" has an unterminated comment!`)
            pos = end + 3
        } else if (text.startsWith('<![CDATA[', pos)) {
            const end = text.indexOf(']]>', pos)
            a.assert(stack.length && end != -1, `SVG outline "${name}" has a misplaced or unterminated CDATA section!`)
            pos = end + 3
        } else if (text.startsWith('<?', pos)) {
            const end = text.indexOf('?>', pos)
            a.assert(end != -1, `SVG outline "${name}" has an unterminated processing instruction!`)
            pos = end + 2
        } else if (text.startsWith('<!DOCTYPE', pos)) {
            doctype_regex.lastIndex = pos
            a.assert(!root_seen && doctype_regex.test(text), `SVG outline "${name}" has a misplaced DOCTYPE, or one with declarations, which are not supported!`)
            pos = doctype_regex.lastIndex
        } else if (text.startsWith('</', pos)) {
            end_tag_regex.lastIndex = pos
            const match = end_tag_regex.exec(text)
            const open = stack.pop()
            a.assert(match && open && open.qname == match[1], `SVG outline "${name}" has malformed markup: unexpected closing tag at offset ${pos}!`)
            pos = end_tag_regex.lastIndex
        } else {
            start_tag_regex.lastIndex = pos
            const match = start_tag_regex.exec(text)
            a.assert(match, `SVG outline "${name}" has malformed markup at offset ${pos}!`)
            const frame = visit(match[1], parse_attributes(match[2], name))
            if (!match[3]) stack.push(frame)
            pos = start_tag_regex.lastIndex
        }
    }

    a.assert(root_seen, `SVG outline "${name}" does not contain an <svg> element!`)
    a.assert(!stack.length, `SVG outline "${name}" has unclosed elements!`)
    return paths
}

// imports a single path, and validates it before a union could hide its problems
const import_svg_path = (raw, index, name, options) => {
    a.assert(a.type(raw)() == 'string', `Path ${index} for SVG outline "${name}" must be a string!`)
    a.assert(raw.trim() !== '', `Path ${index} for SVG outline "${name}" cannot be empty!`)
    // malformed path data is rejected before makerjs could misread it, or hang on it
    const data = path_data(raw, `Path ${index} for SVG outline "${name}"`)
    let model
    try {
        model = m.importer.fromSVGPathData(data, options)
    } catch (ex) {
        throw new Error(`Path ${index} for SVG outline "${name}" could not be imported: ${ex.message}`, {cause: ex})
    }
    // the callback is skipped (and the result is undefined) for models without any geometry
    let closed = undefined
    m.model.findChains(model, (chains, loose) => {
        closed = chains.length > 0 && loose.length === 0 && chains.every(chain => chain.endless)
    })
    a.assert(closed !== undefined, `Path ${index} for SVG outline "${name}" does not contain any geometry!`)
    a.assert(closed, `SVG paths need to be closed shapes (check failed for path ${index} of "${name}")!`)
    return model
}

// the outline type for the given path data (validated and imported for each part that uses it)
// `offset` is the built-in origin of the paths, which a configured origin is relative to
exports.outline = (paths_raw, offset=[0, 0]) => (config, name, points, outlines, units) => {
    a.unexpected(config, name, ['accuracy', 'flip_horizontally', 'flip_vertically', 'origin'])
    // without an explicit accuracy, makerjs derives one from the size of each curve
    // (a fixed fine default would make unions of curved paths orders of magnitude slower)
    const options = {}
    if (config.accuracy !== undefined) {
        options.bezierAccuracy = a.sane(config.accuracy, `${name}.accuracy`, 'number')(units)
        a.assert(Number.isFinite(options.bezierAccuracy) && options.bezierAccuracy > 0, `Field "${name}.accuracy" should be a positive finite number!`)
    }

    const flip_horizontally = a.sane(config.flip_horizontally || false, `${name}.flip_horizontally`, 'boolean')(units)
    const flip_vertically = a.sane(config.flip_vertically || false, `${name}.flip_vertically`, 'boolean')(units)
    const origin = a.xy(config.origin || [0, 0], `${name}.origin`)(units).map((val, index) => offset[index] + val)

    let paths = paths_raw
    if (a.type(paths)() == 'string') paths = [paths]
    a.assert(a.type(paths)() == 'array', `Field "paths" for SVG outline "${name}" must be a string or an array!`)
    a.assert(paths.length > 0, `SVG outline "${name}" must have at least one path!`)

    // separate paths are unioned, while the subpaths of a single path keep their compound topology
    // this happens once per part (even without placements), and each placement gets its own copy
    let shape = undefined
    for (const [index, raw] of paths.entries()) {
        const imported = import_svg_path(raw, index, name, options)
        if (shape === undefined) {
            shape = imported
        } else {
            shape = u.union(shape, imported)
            m.model.simplify(shape)
        }
    }

    if (origin[0] !== 0 || origin[1] !== 0) {
        shape = m.model.moveRelative(shape, [-origin[0], -origin[1]])
    }

    if (flip_horizontally || flip_vertically) {
        shape = m.model.mirror(shape, flip_horizontally, flip_vertically)
    }

    return [point => {
        let placed = u.deepcopy(shape)
        if (point.meta.mirrored) {
            placed = m.model.mirror(placed, true, false)
        }
        const bbox = m.measure.modelExtents(placed)
        return [placed, {low: bbox.low, high: bbox.high}]
    }, units]
}