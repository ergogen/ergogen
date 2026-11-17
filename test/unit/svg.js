const fs = require('fs')
const child_process = require('child_process')
const path = require('path')
const url = require('url')
const m = require('makerjs')
const yaml = require('js-yaml')
const jszip = require('jszip')
const svg_lib = require('../../src/svg')
const io = require('../../src/io')
const u = require('../../src/utils')
const ergogen = require('../../src/ergogen')

describe('SVG', function() {

    this.timeout(120000)

    const ns = 'xmlns="http://www.w3.org/2000/svg"'
    const square = 'M 0 0 L 10 0 L 10 10 L 0 10 Z'
    const far_square = 'M 100 0 L 110 0 L 110 10 L 100 10 Z'
    const doc = (body, attributes=ns) => `<svg ${attributes}>${body}</svg>`
    const fixture_svg = path.join(__dirname, '..', 'fixtures', 'bundle', 'outlines', 'outline_injected_svg.svg')
    const svg_ns = 'http://www.w3.org/2000/svg'

    const round = val => Number(val.toFixed(6)) + 0 // also turns -0 into 0
    const measure = model => {
        const {low, high} = m.measure.modelExtents(model)
        return {low: low.map(round), high: high.map(round), chains: m.model.findChains(model).length}
    }
    const unit_square = {low: [0, -10], high: [10, 0], chains: 1}

    // a real zip bundle, loaded the way the cli loads bundles
    const via_bundle = async (text, part={}) => {
        const name = 'svg_bundle_test'
        const zip = new jszip()
        zip.file('config.yaml', yaml.dump({
            points: {zones: {matrix: null}},
            outlines: {o: [{what: name, where: true, ...part}]}
        }))
        zip.file(`outlines/${name}.svg`, text)
        const loaded = await jszip.loadAsync(await zip.generateAsync({type: 'nodebuffer'}))
        const [config_text, injections] = await io.unpack(loaded)
        for (const [type, injection_name, value] of injections) {
            ergogen.inject(type, injection_name, value)
        }
        const results = await ergogen.process(config_text, {debug: true})
        return measure(results.outlines.o.yaml)
    }

    const build_config = async () => (await import(url.pathToFileURL(path.join(__dirname, '..', '..', 'rollup.config.mjs')).href)).default
    const build_plugin = async () => (await build_config()).plugins.find(plugin => plugin.name == 'svg-outline-plugin')

    // the build transform, with its emitted path data run through the same outline factory
    const via_build = async text => {
        const plugin = await build_plugin()
        const result = plugin.transform(text, '/anywhere/svg_build_test.svg')
        const paths = JSON.parse(/^\s*const paths = (.*?);?$/m.exec(result.code)[1])
        const [maker] = u.svg_paths_to_outline(paths, {}, 'svg_build_test', {}, {}, {})
        return measure(maker({meta: {mirrored: false}})[0])
    }

    const accepted = {
        'plain path without viewBox': [doc(`<path d="${square}"/>`), unit_square],
        'existing fixture': [fs.readFileSync(fixture_svg).toString(), {low: [0, -6.7], high: [14.2, 0], chains: 1}],
        'commented path': [doc(`<path d="${square}"/><!-- <path d="${far_square}"/> -->`), unit_square],
        'unreferenced definitions': [doc(`<defs><path d="${far_square}"/><rect width="5" height="5"/></defs>` +
            `<clipPath id="c"><path d="${far_square}"/><circle r="5"/></clipPath><path d="${square}"/>`), unit_square],
        'spaced attributes and both quotes': [doc(`<path id = 'a' d = "${square}" /><path d\n=\n'${far_square}'></path>`), {low: [0, -10], high: [110, 0], chains: 2}],
        'entities': [doc(`<path id="&lt;&amp;&gt;&quot;&apos;" d="M&#32;0 0 L 10 0 L&#x20;10 10 L 0 10 Z"/>`), unit_square],
        'path effects and foreign elements': [doc(`<defs><inkscape:path-effect d="${far_square}"/></defs>` +
            `<sodipodi:namedview><inkscape:page d="${far_square}"/></sodipodi:namedview>` +
            `<g><path inkscape:original-d="${far_square}" d="${square}"/></g>`,
            `${ns} xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"`), unit_square],
        'svg prefix': [`<s:svg xmlns:s="http://www.w3.org/2000/svg"><s:g><s:path d="${square}"/></s:g></s:svg>`, unit_square],
        'prolog and descriptions': [`\uFEFF<?xml version="1.0"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n` +
            doc(`<title>t</title><desc>d</desc><metadata><rect/></metadata><style><![CDATA[path { fill: red }]]></style>` +
            `<path style="fill:none;;stroke:red" transform="" clip-path="none" d="${square}"/>`) + '\n', unit_square],
        'millimetre dimensions without viewBox do not rescale': [doc(`<path d="${square}"/>`, `${ns} width="20mm" height="5"`), unit_square],
        'matching viewBox': [doc(`<path d="${square}"/>`, `${ns} x="0" y="0" width="14.2mm" height=" 6.7 " viewBox="0,0,14.2,6.7"`), unit_square],
        'viewBox roundoff': [doc(`<path d="${square}"/>`, `${ns} width="37.795mm" viewBox="0 0 37.7953 10"`), unit_square],
        'no paths': [doc('<g/>'), 'must have at least one path'],
        'inherited property names': [`<svg ${ns} xmlns:constructor="urn:other"><constructor:g/>` +
            `<path constructor="x" __proto__="y" style="constructor: x; __proto__: y" d="${square}"/></svg>`, unit_square],
        'unreferenced marker': [doc(`<defs><marker id="m"><circle r="10"/></marker></defs>` +
            `<g style="marker: none"><path marker-end="none" filter="none" style="rotate: none; scale: none" d="${square}"/></g>`), unit_square],
        'compact path data': [doc('<path d="M10 0h-10a5,5 0 0110,0z"/>'), {low: [0, 0], high: [10, 5], chains: 1}],
        'inert important declarations': [doc(`<g style="fill:red !important;Transform:none!important"><path ` +
            `style="stroke:blue; -webkit-transform: none ! IMPORTANT; marker-end:none !important" d="${square}"/></g>`), unit_square],
        'repeated horizontal and vertical lines': [doc('<path d="M0 0H5 10V5 10H0Z"/>'), unit_square],
        'repeated relative horizontal and vertical lines': [doc('<path d="M0 0h5 5v5 5h-5 -5z"/>'), unit_square],
        'repeated backwards relative line': [doc('<path d="M0 0h-2 12v10h-10z"/>'), {low: [-2, -10], high: [10, 0], chains: 1}],
        'default namespace restored after a foreign group': [doc(`<g xmlns="urn:other"><path d="${far_square}"/></g><path d="${square}"/>`), unit_square],
        'svg namespace inside a foreign group': [doc(`<g xmlns="urn:other"><g xmlns="${svg_ns}"><path d="${far_square}"/></g></g><path d="${square}"/>`), unit_square],
        'rebound prefix': [`<svg ${ns} xmlns:s="urn:other"><s:path d="${far_square}"/><g xmlns:s="${svg_ns}"><s:path d="${square}"/></g>` +
            `<s:path d="${far_square}"/></svg>`, unit_square],
        'several prefixes on a group': [doc(`<g xmlns:x="urn:other" xmlns:y="${svg_ns}"><x:path d="${far_square}"/><y:path d="${square}"/></g>`), unit_square],
        'inherited prefix name': [`<svg ${ns} xmlns:__proto__="urn:other"><__proto__:g><path d="${far_square}"/></__proto__:g><path d="${square}"/></svg>`, unit_square],
    }

    const rejected = {
        'malformed markup': [doc(`<path d="${square}"id="x"/>`), 'malformed markup at offset'],
        'unclosed element': [`<svg ${ns}><g>`, 'unclosed elements'],
        'mismatched element': [doc('<g></a>'), 'unexpected closing tag'],
        'stray closing tag': ['</svg>', 'unexpected closing tag'],
        'malformed closing tag': [doc('<g></ g>'), 'unexpected closing tag'],
        'unknown entity': [doc(`<path d="${square}&nbsp;"/>`), 'unknown entity "&nbsp;"'],
        'bare ampersand': [doc(`<path id="a & b" d="${square}"/>`), 'malformed entity "&"'],
        'unterminated entity': [doc(`<path id="&amp" d="${square}"/>`), 'malformed entity "&amp"'],
        'invalid character reference': [doc(`<path id="&#x110000;" d="${square}"/>`), 'invalid character reference'],
        'repeated attribute': [doc(`<path d="${square}" d="${far_square}"/>`), 'repeats the attribute "d"'],
        'empty document': ['', 'does not contain an <svg> element'],
        'other root': ['<html/>', 'should have an <svg> root element'],
        'foreign root': ['<svg xmlns="urn:other"/>', 'should have an <svg> root element'],
        'two roots': [doc('') + doc(''), 'more than one root element'],
        'text outside root': [doc('') + 'text', 'text outside of its root element'],
        'unterminated comment': [doc('<!-- '), 'unterminated comment'],
        'misplaced cdata': ['<![CDATA[x]]>' + doc(''), 'misplaced or unterminated CDATA'],
        'unterminated cdata': [doc('<![CDATA[x'), 'misplaced or unterminated CDATA'],
        'unterminated instruction': ['<?xml ' + doc(''), 'unterminated processing instruction'],
        'doctype declarations': ['<!DOCTYPE svg [<!ENTITY e "M 0 0">]>' + doc(''), 'DOCTYPE'],
        'undeclared prefix': [doc('<x:g/>'), 'undeclared namespace prefix "x"'],
        'unsupported element': [doc(`<switch><path d="${square}"/></switch>`), 'unsupported element <switch>'],
        'unprefixed path effect': [doc(`<path-effect d="${square}"/>`), 'unsupported element <path-effect>'],
        'path without data': [doc('<path/>'), 'without "d" data at index 0'],
        'nested viewport': [doc(`<svg><path d="${square}"/></svg>`), 'nested <svg> viewport'],
        'path transform': [doc(`<path transform="translate(5 0)" d="${square}"/>`), 'transform on <path> affecting path 0'],
        'group scale': [doc(`<g transform="scale(2)"><path d="${square}"/></g>`), 'transform on <g> affecting path 0'],
        'nested ancestor transform': [doc(`<path d="${square}"/><g transform="rotate(5)"><g><path d="${square}"/></g></g>`), 'transform on <g> affecting path 1'],
        'root transform': [doc(`<path d="${square}"/>`, `${ns} transform="scale(2)"`), 'transform on <svg> affecting path 0'],
        'css transform': [doc(`<a style="transform: translate(5px)"><path d="${square}"/></a>`), 'transform on <a> affecting path 0'],
        'clipping': [doc(`<defs><clipPath id="c"><rect/></clipPath></defs><g clip-path="url(#c)"><path d="${square}"/></g>`), 'uses "clip-path" on <g>'],
        'masking': [doc(`<path style="Mask: url(#m)" d="${square}"/>`), 'uses "mask" on <path>'],
        'width in inches': [doc(`<path d="${square}"/>`, `${ns} width="10in"`), 'Field "width" of SVG outline'],
        'percentage height': [doc(`<path d="${square}"/>`, `${ns} height="100%"`), 'Field "height" of SVG outline'],
        'zero width': [doc(`<path d="${square}"/>`, `${ns} width="0mm"`), 'positive length in mm'],
        'infinite width': [doc(`<path d="${square}"/>`, `${ns} width="1e999"`), 'positive length in mm'],
        'scaled viewBox': [doc(`<path d="${square}"/>`, `${ns} width="10mm" height="10mm" viewBox="0 0 37.795 37.795"`), 'scaled viewBoxes are not supported'],
        'offset viewBox': [doc(`<path d="${square}"/>`, `${ns} viewBox="100 100 10 10"`), 'should start at "0 0"'],
        'offset viewport': [doc(`<path d="${square}"/>`, `${ns} x="5"`), 'Field "x" of SVG outline'],
        'malformed viewport': [doc(`<path d="${square}"/>`, `${ns} y="a"`), 'Field "y" of SVG outline'],
        'short viewBox': [doc(`<path d="${square}"/>`, `${ns} viewBox="0 0 10"`), 'four finite numbers'],
        'nonnumeric viewBox': [doc(`<path d="${square}"/>`, `${ns} viewBox="0 0 10 x"`), 'four finite numbers'],
        'infinite viewBox': [doc(`<path d="${square}"/>`, `${ns} viewBox="0 0 1e999 10"`), 'four finite numbers'],
        'empty viewBox': [doc(`<path d="${square}"/>`, `${ns} viewBox="0 0 0 10"`), 'positive width and height'],
        'misplaced doctype': [doc('') + '<!DOCTYPE svg>', 'misplaced DOCTYPE'],
        'inherited entity': [doc(`<path id="&constructor;" d="${square}"/>`), 'unknown entity "&constructor;"'],
        'inherited prefix': [doc('<constructor:g/>'), 'undeclared namespace prefix "constructor"'],
        'inherited prefix without any namespaces': ['<svg><__proto__:g/></svg>', 'undeclared namespace prefix "__proto__"'],
        'prefix of a sibling': [doc(`<g xmlns:x="${svg_ns}"><x:path d="${square}"/></g><x:g/>`), 'undeclared namespace prefix "x"'],
        'prefix of a child': [doc(`<g><x:g xmlns:x="${svg_ns}"/><x:g/></g>`), 'undeclared namespace prefix "x"'],
        'undeclared prefix in a foreign group': [doc('<f:g xmlns:f="urn:other"><x:g/></f:g>'), 'undeclared namespace prefix "x"'],
        'marker reference': [doc(`<defs><marker id="m"><circle r="10"/></marker></defs><path marker-end="url(#m)" d="M0 0L1 0L1 1Z"/>`),
            'uses "marker-end" on <path>, markers are not supported! Convert the markers to paths'],
        'inherited css marker': [doc(`<g style="marker-start: url(#m)"><path d="${square}"/></g>`), 'uses "marker-start" on <g>'],
        'marker shorthand': [doc(`<path marker="url(#m)" d="${square}"/>`), 'uses "marker" on <path>'],
        'mid markers': [doc(`<path style="marker-mid:url(#m)" d="${square}"/>`), 'uses "marker-mid" on <path>'],
        'filter': [doc(`<g filter="url(#f)"><path d="${square}"/></g>`), 'uses "filter" on <g>, filters are not supported!'],
        'css rotate': [doc(`<g style="rotate: 45deg"><path d="${square}"/></g>`), 'transform on <g> affecting path 0'],
        'css scale': [doc(`<path style="scale: 2" d="${square}"/>`), 'transform on <path> affecting path 0'],
        'css translate': [doc(`<path d="${square}"/><path style="translate: 5px" d="${square}"/>`), 'transform on <path> affecting path 1'],
        'important css transform before an inert one': [doc(`<path style="transform: scale(2) !important; transform: none" d="${square}"/>`),
            'transform on <path> affecting path 0'],
        'inert css transform after an active one on an ancestor': [doc(`<g><g style="transform:scale(2);transform:none"><path d="${square}"/></g></g>`),
            'transform on <g> affecting path 0'],
        'important css marker before an inert one': [doc(`<path style="marker-end:url(#m)!important;marker-end:none" d="${square}"/>`),
            'uses "marker-end" on <path>'],
        'vendor prefixed css transform': [doc(`<path style="-webkit-transform: scale(2)" d="${square}"/>`), 'transform on <path> affecting path 0'],
        'vendor prefixed css clipping': [doc(`<g style="-webkit-clip-path: url(#c)"><path d="${square}"/></g>`), 'uses "clip-path" on <g>'],
        'css comment after a property name': [doc(`<path style="transform/**/: scale(2)" d="${square}"/>`),
            'has a comment, an escape or a rule block in the style of <path>, which is not supported! Remove it from the style'],
        'css comment before a declaration': [doc(`<path style="/* a: b */ transform: rotate(3deg)" d="${square}"/>`), 'comment, an escape or a rule block in the style of <path>'],
        'css comment on an ancestor': [doc(`<g style="fill: red /* marker: url(#m) */"><path d="${square}"/></g>`), 'comment, an escape or a rule block in the style of <g>'],
        'css comment from entities': [doc(`<path style="transform/&#42;&#42;/: scale(2)" d="${square}"/>`), 'comment, an escape or a rule block in the style of <path>'],
        'css escape in a property name': [doc(`<path style="tr\\61nsform: scale(2)" d="${square}"/>`), 'comment, an escape or a rule block in the style of <path>'],
        'css transform after an at-rule block': [doc(`<path style="@x{} transform:scale(2)" d="${square}"/>`),
            'has a comment, an escape or a rule block in the style of <path>, which is not supported! Remove it from the style'],
        'css transform after an at-rule block on an ancestor': [doc(`<g style="@media all{} transform:scale(2)"><path d="${square}"/></g>`),
            'rule block in the style of <g>'],
        'css marker after an at-rule block': [doc(`<path style="@x{} marker-end:url(#m)" d="${square}"/>`), 'rule block in the style of <path>'],
        'important css transform after an at-rule block': [doc(`<path style="@x{} transform:scale(2)!important;transform:none" d="${square}"/>`),
            'rule block in the style of <path>'],
        'css at-rule block from entities': [doc(`<path style="&#64;x&#123;&#125; transform:scale(2)" d="${square}"/>`),
            'rule block in the style of <path>'],
        'css at-rule from entities': [doc(`<path style="&#64;x{} transform:scale(2)" d="${square}"/>`), 'rule block in the style of <path>'],
        'css block without an at-rule': [doc(`<path style="x{} transform:scale(2)" d="${square}"/>`), 'rule block in the style of <path>'],
        'truncated path data': [doc(`<path d="${square}"/><path d="M 0 0 C 1 1 2 2"/>`), 'Path 1 for SVG outline'],
        'empty path data': [doc('<path d=""/>'), 'Path 0 for SVG outline'],
    }
    // malformed path data, which makerjs would misread or hang on
    for (const [title, data, expected] of [
        ['cubic', 'M 0 0 C 1 1 2 2', 'the command "C" at offset 6 takes 6 arguments per segment, not 4'],
        ['quadratic', 'M 0 0 Q 1 1', 'the command "Q" at offset 6 takes 4 arguments'],
        ['smooth cubic', 'M 0 0 S 1 1', 'the command "S" at offset 6 takes 4 arguments'],
        ['smooth quadratic', 'M 0 0 T 1', 'the command "T" at offset 6 takes 2 arguments'],
        ['line', 'M 0 0 L 10 0 L 10 10 L 4 Z', 'the command "L" at offset 21 takes 2 arguments'],
        ['line to origin', 'M 0 0 L 10 0 L 10 10 L 0 Z', 'the command "L" at offset 21 takes 2 arguments'],
        ['horizontal', 'M 0 0 H 10 V 10 H Z', 'the command "H" at offset 16 takes 1 argument per segment, not 0'],
        ['moveto', 'M 0 L 10 0 L 10 10 Z', 'the command "M" at offset 0 takes 2 arguments'],
        ['nonfinite', 'M 0 0 L 1e999 0 L 0 10 Z', 'the number "1e999" at offset 8 is not finite'],
        ['trailing command', `${square} X`, 'unexpected "X" at offset 30'],
        ['trailing arguments', `${square} R 1 2`, 'unexpected "R" at offset 30'],
    ]) {
        rejected[`malformed ${title}`] = [doc(`<path d="${data}"/>`), `Path 0 for SVG outline`]
        rejected[`malformed ${title} message`] = [doc(`<path d="${data}"/>`), `has invalid path data, ${expected}`]
    }
    for (const shape of ['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'image', 'use']) {
        rejected[`visible ${shape}`] = [doc(`<path d="${square}"/><g><${shape}/></g>`), `contains a visible <${shape}>, but only paths are supported! Convert objects to paths`]
    }

    it('extract', function() {
        // multiple paths, in document order, with their data decoded
        svg_lib.extract(doc(`<path d='${square}'/><g><path d="M&#x20;1 1"/></g>`), 'n').should.deep.equal([square, 'M 1 1'])
        // non-text input
        svg_lib.extract.bind(this, undefined, 'n').should.throw('SVG outline "n" should be text')
        // errors name the outline
        svg_lib.extract.bind(this, doc('<rect/>'), 'named').should.throw('SVG outline "named" contains a visible <rect>')
        svg_lib.tolerance.should.equal(1e-4)
    })

    it('path data', function() {
        const valid = (data, expected) => svg_lib.path_data(data, 'P').should.equal(expected)
        const invalid = (data, snippet) => svg_lib.path_data.bind(this, data, 'P').should.throw(`P has invalid path data, ${snippet}!`)
        // every command, absolute and relative, with repeated segments and surrounding whitespace
        valid(' \t\nM0 0 1 1C1 1 2 2 3 3 4 4 5 5 6 6S4 4 5 5c1 1 2 2 3 3s1,1,2,2Q1 1 2 2T3 3q1 1 2 2t1 1L1 2l3 4H1h2V3v4A1 2 3 1 0 5 6zM 1 1z\f\r',
            'M 0 0 1 1 C 1 1 2 2 3 3 4 4 5 5 6 6 S 4 4 5 5 c 1 1 2 2 3 3 s 1 1 2 2 Q 1 1 2 2 T 3 3 q 1 1 2 2 t 1 1 L 1 2 l 3 4 H 1 h 2 V 3 v 4 A 1 2 3 1 0 5 6 z M 1 1 z')
        // compact numbers: signs, fractions, exponents, leading zeros and compressed arc flags
        valid('m0-0l+1e1,0,0 10-.5.5 05 1.5E-1a1.5,1.5 0 018.6,2.2Z', 'm 0 -0 l 10 0 0 10 -0.5 0.5 5 0.15 a 1.5 1.5 0 0 1 8.6 2.2 Z')
        valid('M0 0a0 -0 -30 1,1 1 1', 'M 0 0 a 0 -0 -30 1 1 1 1')
        // repeated horizontal and vertical arguments each get their own command, other repeats are kept
        valid('M0 0 1 1H5 10V10,20h1-2v3 4 5L1 1 2 2', 'M 0 0 1 1 H 5 H 10 V 10 V 20 h 1 h -2 v 3 v 4 v 5 L 1 1 2 2')
        // empty, or not starting with a moveto
        invalid('', 'it should start with a moveto ("M" or "m")')
        invalid(' ', 'it should start with a moveto ("M" or "m")')
        invalid('L 1 1', 'it should start with a moveto ("M" or "m"), not "L"')
        // unknown commands and stray characters
        invalid('M 0 0 X', 'unexpected "X" at offset 6')
        invalid('M 0 0 Z 1', 'unexpected "1" at offset 8')
        invalid('M 0 0 garbage', 'unexpected "g" at offset 6')
        invalid('M 0 0 L 1 2e', 'unexpected "e" at offset 11')
        invalid('M 0 0 L Infinity 0', 'the command "L" at offset 6 takes 2 arguments per segment, not 0')
        // misplaced commas
        invalid('M,0 0', 'the command "M" at offset 0 takes 2 arguments per segment, not 0')
        invalid('M 0,0,', 'expected a number after the comma at offset 6')
        invalid('M 0 0 L 1,,1', 'expected a number after the comma at offset 10')
        invalid('M 0 0 A 1 1 0 0,2 1 1', 'expected a flag after the comma at offset 16')
        // wrong argument counts
        invalid('M 0 0 A 1 1 0 0 1 1', 'the command "A" at offset 6 takes 7 arguments per segment, not 6')
        invalid('M 0 0 A 1 1 0 2 1 1 1', 'the command "A" at offset 6 takes 7 arguments per segment, not 3')
        invalid('M 0 0 V', 'the command "V" at offset 6 takes 1 argument per segment, not 0')
        // numbers
        invalid('M 0 -1e999', 'the number "-1e999" at offset 4 is not finite')
        invalid('M 0 0 a -1 1 0 0 1 1 1', 'the arc radius "-1" at offset 8 is negative')
        invalid('M 0 0 A 1 -1 0 0 1 1 1', 'the arc radius "-1" at offset 10 is negative')
    })

    it('number grammar', function() {
        const root = attributes => svg_lib.extract(doc(`<path d="${square}"/>`, `${ns} ${attributes}`), 'n')
        // signs, leading and trailing dots, leading zeros, exponents and negative zero
        for (const attributes of ['width="5."', 'width=".5e1mm"', 'width="+5E0"', 'width=" 05mm "', 'x="-0" y=".0e-5"', 'x="+0." y="0e5"',
            'width="5" height="5" viewBox="0,0,5.,+.5E+1"', 'viewBox="-0 0. 1e1 10"']) {
            root(attributes).should.deep.equal([square], attributes)
        }
        // numbers without digits, with repeated parts or with exponents without digits
        for (const [attributes, field] of [['width="."', 'width'], ['width="5..mm"', 'width'], ['width="e5"', 'width'], ['width="1e"', 'width'],
            ['width="--1"', 'width'], ['width="5 mm"', 'width'], ['height="1e+"', 'height'], ['x="0.0."', 'x'], ['y="0x0"', 'y'],
            ['viewBox="0 0 5. ."', 'viewBox'], ['viewBox="0 0 .e1 5"', 'viewBox']]) {
            root.bind(this, attributes).should.throw(`Field "${field}" of SVG outline "n"`)
        }
    })

    // svg.extract in its own node process, which is stopped at the deadline (instead of hanging the tests)
    const isolated = (inputs, args=[]) => {
        const deadline = 10000
        const script = `const svg = require(${JSON.stringify(require.resolve('../../src/svg'))})
            const results = {}
            for (const [name, text] of Object.entries(JSON.parse(require('fs').readFileSync(0, 'utf8')))) {
                try {
                    results[name] = svg.extract(text, name)
                } catch (ex) {
                    results[name] = ex.message
                }
            }
            process.stdout.write(JSON.stringify(results))`
        const result = child_process.spawnSync(process.execPath, [...args, '-e', script],
            {input: JSON.stringify(inputs), encoding: 'utf8', timeout: deadline, maxBuffer: 2 ** 26})
        should.equal(result.signal, null, `svg.extract did not finish within ${deadline}ms and the heap limit`)
        result.status.should.equal(0, result.stderr)
        return JSON.parse(result.stdout)
    }

    it('long numbers', function() {
        // rejecting a long malformed number took quadratic time (about 40s for 100000 digits)
        const digits = '1'.repeat(100000)
        const zeros = '0'.repeat(100000)
        const results = isolated({
            width: doc(`<path d="${square}"/>`, `${ns} width="${digits}px"`),
            x: doc(`<path d="${square}"/>`, `${ns} x="${digits}a"`),
            viewBox: doc(`<path d="${square}"/>`, `${ns} viewBox="0 0 ${digits}a 10"`),
            path: doc(`<path d="M 0 0 L 1 ${zeros}1x 0 Z"/>`),
            valid: doc(`<path d="M0 0L${zeros}5 0 0 5Z"/>`, `${ns} x="${zeros}" width="${zeros}5mm" height=" ${zeros}.5e1 " viewBox="0 0 ${zeros}5. 5"`),
        })
        results.width.should.have.string('Field "width" of SVG outline "width" should be a positive length in mm')
        results.x.should.have.string('Field "x" of SVG outline "x" should be 0')
        results.viewBox.should.have.string('Field "viewBox" of SVG outline "viewBox" should be four finite numbers')
        results.path.should.equal(`Path 0 for SVG outline "path" has invalid path data, unexpected "x" at offset ${zeros.length + 11}!`)
        results.valid.should.deep.equal([`M0 0L${zeros}5 0 0 5Z`])
    })

    it('deeply nested namespaces', function() {
        // every element copied all of its parent's namespace bindings, which took time and memory proportional to
        // the depth times the number of bindings (here well beyond the heap limit of the process)
        const depth = 20000
        const bindings = Array.from({length: 1000}, (_, i) => `xmlns:p${i}="urn:p${i}"`).join(' ')
        isolated({
            nested: `<svg ${ns} ${bindings}>${'<g>'.repeat(depth)}<path d="${square}"/><p999:g/>${'</g>'.repeat(depth)}</svg>`,
            undeclared: `<svg ${ns} ${bindings}>${'<g>'.repeat(depth)}<p1000:g/>${'</g>'.repeat(depth)}</svg>`,
        }, ['--max-old-space-size=128']).should.deep.equal({
            nested: [square],
            undeclared: 'SVG outline "undeclared" uses the undeclared namespace prefix "p1000"!',
        })
    })

    // the same fixtures must give the same results when loaded from a bundle and when built
    const runners = {'bundle loading': via_bundle, 'build transform': via_build}
    const scope = {'bundle loading': 'svg_bundle_test', 'build transform': 'svg_build_test'}
    for (const [runner_name, run] of Object.entries(runners)) {
        describe(runner_name, function() {
            for (const [title, [text, expected]] of Object.entries(accepted)) {
                it(title, async function() {
                    if (typeof expected == 'string') {
                        await run(text).should.be.rejectedWith(expected)
                    } else {
                        (await run(text)).should.deep.equal(expected)
                    }
                })
            }
            for (const [title, [text, expected]] of Object.entries(rejected)) {
                it(title, async function() {
                    await run(text).should.be.rejectedWith(`SVG outline "${scope[runner_name]}"`)
                    await run(text).should.be.rejectedWith(expected)
                })
            }
        })
    }

    it('bundled svg outlines take no paths', async function() {
        // fixed path data cannot take an ignored `paths` option
        await via_bundle(doc(`<path d="${square}"/>`), {paths: far_square}).should.be.rejectedWith('Unexpected key "paths" within field "outlines.o.0"')
    })

    it('build transform skips other files', async function() {
        should.equal((await build_plugin()).transform('const x = 1', '/anywhere/x.js'), null)
    })

    it('ergogen export reimport', async function() {
        const config = {
            points: {zones: {matrix: null}},
            outlines: {o: [
                {what: 'circle', radius: 5, where: true},
                {what: 'rectangle', size: [30, 4], where: true},
                {what: 'circle', radius: 1, where: true, adjust: {shift: [-10, 5]}},
            ]}
        }
        const results = await ergogen.process(config, {debug: true})
        const original = measure(results.outlines.o.yaml)
        original.chains.should.equal(2)
        // exports are positioned at the origin and rounded to 3 decimals, so compare sizes to 0.01mm
        const size = ({low, high, chains}) => ({size: [0, 1].map(i => Number((high[i] - low[i]).toFixed(2))), chains})
        size(await via_bundle(results.outlines.o.svg)).should.deep.equal(size(original))
        size(await via_build(results.outlines.o.svg)).should.deep.equal(size(original))
    })

    it('bundled build execution', async function() {
        const rollup = require('rollup')
        const json = require('@rollup/plugin-json')
        const commonjs = require('@rollup/plugin-commonjs')
        const config = await build_config()
        const plugin = await build_plugin()
        const ergogen_path = path.join(__dirname, '..', '..', 'src', 'ergogen.js')
        const entries = {
            'cjs_entry.js': `const ergogen = require(${JSON.stringify(ergogen_path)})\n` +
                `ergogen.inject('outline', 'built', require(${JSON.stringify(fixture_svg)}))\n` +
                'module.exports = ergogen',
            'esm_entry.js': `import ergogen from ${JSON.stringify(ergogen_path)}\n` +
                `import built from ${JSON.stringify(fixture_svg)}\n` +
                'ergogen.inject(\'outline\', \'built\', built)\n' +
                'export default ergogen',
        }
        for (const [entry, code] of Object.entries(entries)) {
            const id = path.join(__dirname, entry)
            const virtual = {
                name: 'virtual-entry',
                resolveId: source => source == entry ? id : null,
                load: source => source == id ? code : null
            }
            const bundle = await rollup.rollup({input: entry, external: config.external, plugins: [virtual, plugin, json(), commonjs()]})
            const {output} = await bundle.generate({...config.output, file: undefined})
            await bundle.close()

            // browser-like umd execution: no require, module, exports or define, with the declared globals in this realm
            const root = {}
            for (const [dependency, global] of Object.entries(config.output.globals)) {
                root[global] = require(dependency)
            }
            new Function('globalThis', 'self', 'global', 'require', 'module', 'exports', 'define', output[0].code).call(root, root, root, root)
            root.ergogen.process.should.be.a('function')
            const results = await root.ergogen.process({
                points: {zones: {matrix: {columns: {left: null, right: null}}}},
                outlines: {o: [{what: 'built', where: true}]}
            }, {debug: true})
            const chains = m.model.findChains(results.outlines.o.yaml).map(chain => measure(m.chain.toNewModel(chain))).sort((x, y) => x.low[0] - y.low[0])
            chains.should.deep.equal([
                {low: [0, -6.7], high: [14.2, 0], chains: 1},
                {low: [19, -6.7], high: [33.2, 0], chains: 1},
            ], entry)
        }
    })
})