const extend = require('../prepare').extend
const units = require('../units')

function mil(mm) {
    return mm * units.units.mil
}

function mm(mm) {
    return mm
}

const VIA_SIZE = 0.8
const VIA_DRILL = 0.4
const JUMPER_SIZE = mil(110)
const FRONT = 'F'
const BACK = 'B'

/**
 * @param {Array} items
 * @returns {Array}
 */
function flat_join(items) {
    const flat = []

    function impl(dest, i) {
        i.forEach((item) => {
            if (Array.isArray(item)) {
                impl(dest, item)
            } else if (item && item !== '') {
                dest.push(item)
            }
        })
    }

    impl(flat, items)
    return flat.join('\n')
}

/**
 * @typedef {Object} PinMetrics
 * @property {number} width
 * @property {number} height
 * @property {number} drill
 * @property {number} pad_length
 */

/**
 * @typedef {Object} BreakoutMetrics
 * @property {number} pin_offset
 * @property {number} pin_spacing
 * @property {number} margin_x
 * @property {number} margin_y
 */

/**
 * @typedef {Object} PcbMetrics
 * @property {number} trace_offset
 * @property {number} via_offset
 * @property {PinMetrics} pins
 * @property {BreakoutMetrics} breakout
 */

/**
 * @type {PcbMetrics}
 */
const DEFAULT_METRICS = {
    trace_offset: mil(30),
    via_offset: mil(30),
    pins: {
        width: mm(1.6),
        height: mm(1.6),
        drill: mm(1.1),
        pad_length: mm(3.5),
    },
    breakout: {
        pin_offset: mil(350),
        pin_spacing: mil(100),
        margin_x: mil(55),
        margin_y: mil(65),
    },
}

/**
 * Emits a value or a default
 *
 * @param {*} value
 * @param {*} [fallback]
 */
function def(value, fallback) {
    return typeof value !== 'undefined' && value !== null ? value : fallback || ''
}

/**
 * Optionally emits a value
 *
 * @param {bool} include
 * @param {*} [value]
 */
function opt(include, value) {
    return include ? def(value) : ''
}

/**
 * Creates a line
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {string} side
 */
function line(side, x1, y1, x2, y2) {
    return `
  (fp_line 
    (start ${x1} ${y1})
    (end ${x2} ${y2})
    (layer ${side}.SilkS)
    (width 0.12))`
}

/**
 * Creates a rectangle
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {string} side
 */
function rect(side, x1, y1, x2, y2) {
    return [
        line(side, x1, y1, x1, y2),
        line(side, x1, y1, x2, y1),
        line(side, x2, y2, x1, y2),
        line(side, x2, y2, x2, y1),
    ]
}

/**
 * Creates a registration mark
 *
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {string} options.side
 */
function reg(metrics, options) {
    return rect(
        options.side,
        options.x - metrics.breakout.margin_x,
        options.y - metrics.breakout.margin_y,
        options.x + metrics.breakout.margin_x,
        options.y + metrics.breakout.margin_y
    )
}

/**
 * Creates a via through-hole
 *
 * @param {Object} options
 * @param {number} options.i
 * @param {string} options.net
 * @param {number} options.x
 * @param {number} options.y
 */
function via_thru_hole(options) {
    return `
  (pad ${def(options.i, '""')} thru_hole oval 
    (at ${options.x} ${options.y}) 
    (size ${VIA_SIZE} ${VIA_SIZE}) 
    (drill ${VIA_DRILL})
    (layers "*.Cu")
    (zone_connect 0)
    (options${opt(options.net, ' (clearance outline)')})
    ${def(options.net)})`
}

/**
 * Creates a pad for a pin hole
 *
 * @param {PcbMetrics} metrics
 * @param {Object} options
 * @param {number} options.i
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.rot
 * @param {number} options.sign
 * @param {number} options.sides
 */
function pin_pad(metrics, options) {
    const w = options.w || metrics.pins.pad_length
    const h = options.h || metrics.pins.height
    return options.sides.map(
        (side) => `
  (pad ${def(options.i, '""')} smd rect
      (at ${options.x} ${options.y} ${options.rot})
      (size ${w} ${h})
      (drill (offset ${((h - w) / 2) * options.sign} 0))
      (layers ${side}.Cu ${side}.Mask)
      (clearance 0.1)
      (zone_connect 0)
      (options (clearance outline))
      ${def(options.net)})`
    )
}

/**
 * Creates an oval through-hole and pad
 *
 * @param {PcbMetrics} metrics
 * @param {Object} options
 * @param {number} options.i
 * @param {string} options.net
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.w
 * @param {number} options.h
 * @param {number} options.rot
 * @param {boolean} options.rect
 */
function thru_hole(metrics, options) {
    return `
  (pad ${def(options.i, '""')} thru_hole ${options.rect ? 'rect' : 'oval'} 
    (at ${options.x} ${options.y} ${def(options.rot)})
    (size ${options.w || metrics.pins.width} ${options.h || metrics.pins.height}) 
    (drill ${metrics.pins.drill})
    (layers "*.Cu" "*.Mask")
    (zone_connect 0)
    (options${opt(options.net, ' (clearance outline)')})
    ${def(options.net)})`
}

/**
 * Creates the first pad variant
 *
 * @param {PcbMetrics} metrics
 * @param {Object} options
 * @param {number} options.i
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.w
 * @param {number} options.sign
 * @param {string} options.net
 * @param {string} options.side
 */
function jumper(metrics, options) {
    const jumper_rot = (options.sign + 1) * 90
    const trace_width = options.w - JUMPER_SIZE

    return `
    ${'' /* pin to jumper */}
    (pad "" smd custom
      (at ${options.x} ${options.y - mil(50) * options.sign} ${options.rot + 180})
      (size 0.25 1) 
      (layers ${options.side}.Cu)
      (clearance 0.1)
      (zone_connect 0)
      (options (clearance outline) (anchor rect))
      (primitives))
    ${'' /* jumper (pin side) */}
    (pad "" smd custom
      (at ${options.x} ${options.y - mil(70) * options.sign} ${options.rot + jumper_rot})
      (size 0.1 0.1)
      (layers ${options.side}.Cu ${options.side}.Mask)
      (clearance 0.1)
      (zone_connect 0)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts (xy 0.6 -0.4) (xy -0.6 -0.4) (xy -0.6 -0.2) (xy 0 0.4) (xy 0.6 -0.2)) (width 0))
      ))
    ${'' /* jumper (via side) */}
    (pad ${def(options.i, '""')} smd custom
      ${def(options.net)}
      (at ${options.x} ${options.y - JUMPER_SIZE * options.sign} ${options.rot + jumper_rot})
      (size 1.2 0.5)
      (layers ${options.side}.Cu ${options.side}.Mask)
      (clearance 0.1)
      (zone_connect 0)
      (options (clearance outline) (anchor rect))
      (primitives
        (gr_poly (pts (xy 0.6 0) (xy -0.6 0) (xy -0.6 -1) (xy 0 -0.4) (xy 0.6 -1)) (width 0))
      ))
    ${'' /* trace between jumper and via */}
    (pad ${def(options.i, '""')} smd custom
      ${def(options.net)}
      (at ${options.x} ${options.y - JUMPER_SIZE * options.sign} ${options.rot + 180})
      (size 0.25 0.25)
      (layers ${options.side}.Cu)
      (zone_connect 0)
      (options (clearance outline) (anchor circle))
      (primitives
        (gr_line
          (start 0 0)
          (end ${metrics.trace_offset * options.sign} ${metrics.trace_offset * options.sign})
          (width 0.25))
        (gr_line 
          (start ${metrics.trace_offset * options.sign} ${metrics.trace_offset * options.sign})
          (end ${metrics.trace_offset * options.sign} ${(trace_width - metrics.trace_offset) * options.sign})
          (width 0.25))
        (gr_line
          (start ${metrics.trace_offset * options.sign} ${(trace_width - metrics.trace_offset) * options.sign})
          (end 0 ${trace_width * options.sign})
          (width 0.25))
      ))`
}

/**
 * Creates a column
 *
 * @param {PcbMetrics} metrics
 * @param {Object} options
 * @param {number} options.i
 * @param {string} options.net
 * @param {number} options.x
 * @param {number} options.w
 * @param {number} options.h
 * @param {number} options.rot
 * @param {number} options.sign
 * @param {number} options.offset
 */
function jumper_pair(metrics, options) {
    return [
        jumper(metrics, {
            x: options.x,
            y: metrics.breakout.pin_offset * options.sign,
            w: metrics.breakout.pin_offset - options.offset,
            rot: options.rot,
            side: BACK,
            i: options.i,
            net: options.net,
            sign: options.sign,
        }),
        via_thru_hole({
            x: options.x,
            y: options.offset * options.sign,
            i: options.i,
            net: options.net,
        }),
        jumper(metrics, {
            x: options.x,
            y: metrics.breakout.pin_offset * -options.sign,
            w: metrics.breakout.pin_offset + options.offset,
            rot: options.rot,
            side: FRONT,
            i: options.i,
            net: options.net,
            sign: -options.sign,
        }),
    ]
}

/**
 * Creates a column
 *
 * @param {PcbMetrics} metrics
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.rot
 * @param {boolean} options.jumper
 * @param {boolean} options.reversible
 * @param {string} options.side
 * @param {Object} options.top
 * @param {number} options.top.i
 * @param {number} options.top.net
 * @param {boolean} options.top.pad
 * @param {boolean} options.top.reg
 * @param {boolean} options.top.enabled
 * @param {boolean} options.top.rect
 * @param {Object} options.bottom
 * @param {number} options.bottom.i
 * @param {number} options.bottom.net
 * @param {boolean} options.bottom.pad
 * @param {boolean} options.bottom.reg
 * @param {boolean} options.bottom.enabled
 * @param {boolean} options.bottom.rect
 */
function column(metrics, options) {
    const sides = options.jumper ? [FRONT, BACK] : [options.side]
    const both_pads =
        options.reversible &&
        ((options.top.enabled && options.top.pad) || (options.bottom.enabled && options.bottom.pad))
    const single_jumper = options.jumper && options.top.enabled !== options.bottom.enabled

    return [
        [-1, options.bottom, options.top],
        [1, options.top, options.bottom],
    ].map(([sign, o, opp]) => [
        // The pin hole
        thru_hole(metrics, {
            x: options.x,
            y: metrics.breakout.pin_offset * sign,
            w: options.w,
            h: options.h,
            rot: options.rot,
            i: options.jumper || !o.enabled ? null : o.i,
            net: options.jumper || !o.enabled ? null : o.net,
            rect: o.rect,
        }),
        // The registration mark
        opt(
            o.reg,
            reg(metrics, {
                x: options.x,
                y: metrics.breakout.pin_offset * sign,
                side: options.side || FRONT,
            })
        ),
        // The registration mark for the opposite side, if the footprint is reversible
        opt(
            options.reversible && opp.reg,
            reg(metrics, {
                x: options.x,
                y: metrics.breakout.pin_offset * sign,
                side: options.side !== FRONT ? FRONT : BACK,
            })
        ),
        // The jumper trace
        opt(
            o.enabled && options.jumper,
            jumper_pair(metrics, {
                i: o.i,
                net: o.net,
                x: options.x,
                rot: options.rot,
                jumper: options.jumper,
                sign: sign,
                // Align the via to the center of the footprint when a jumper from only one side is populated
                offset: single_jumper ? 0 : metrics.trace_offset,
            })
        ),
        // The pad for soldering a castellated breakout
        opt(
            both_pads || o.pad,
            pin_pad(metrics, {
                x: options.x,
                y: metrics.breakout.pin_offset * sign,
                rot: options.rot + 90,
                sign: sign,
                i: options.jumper ? null : o && o.i,
                net: options.jumper ? null : o && o.net,
                sides: sides,
            })
        ),
    ])
}

function parse_units(o) {
    const u = {}
    for (const prop of Object.getOwnPropertyNames(o)) {
        const value = o[prop]
        switch (typeof value) {
            case 'number':
                u[prop] = value
                break
            case 'string':
                u[prop] = value
                break
        }
    }
    const result = units.parse({
        units: u,
    })
    for (const prop of Object.getOwnPropertyNames(o)) {
        const value = o[prop]
        switch (typeof value) {
            case 'object':
                result[prop] = parse_units(value)
                break
            case 'number':
            case 'string':
                break
            default:
                result[prop] = value
                break
        }
    }
    return result
}

module.exports = {
    params: {
        class: 'MCU',
        part: 'Parametric',
        outline: true,
        reversible: false,
        pads: true,
        metrics: DEFAULT_METRICS,
        columns: {type: 'object'},
    },
    body: (p) => {
        const columns = p.columns
        const col_count = columns.length
        const reversible = p.reversible || columns.findIndex((v) => v.jumper === true) >= 0

        const metrics = extend({}, DEFAULT_METRICS, parse_units(p.metrics))
        const result = []
        const width = (col_count - 1) * metrics.breakout.pin_spacing
        const w2 = width / 2

        result.push(
            ...[FRONT, BACK].map((side) =>
                opt(
                    p.outline,
                    rect(
                        side,
                        -w2 - metrics.breakout.margin_x,
                        -metrics.breakout.pin_offset - metrics.breakout.margin_y,
                        w2 + metrics.breakout.margin_x,
                        metrics.breakout.pin_offset + metrics.breakout.margin_y
                    )
                )
            )
        )

        for (let i = 0; i < col_count; i++) {
            const j = col_count * 2 - i - 1
            const col = columns[i]
            let top = typeof col.top === 'string' ? {name: col.top} : col.top || {name: `${p.ref}_P${i}`}
            let bottom = typeof col.bottom === 'string' ? {name: col.bottom} : col.bottom || {name: `${p.ref}_P${j}`}
            let top_gnd = top.name && top.name.indexOf('GND') >= 0
            let bottom_gnd = bottom.name && bottom.name.indexOf('GND') >= 0

            // If there are two grounds with the same label in the same column then there is no need to create a jumper
            let grounds = top_gnd && top.name === bottom.name
            let jumper = p.reversible && !grounds

            top = Object.assign(
                {
                    jumper,
                    pad: p.pads,
                    reg: i == 0,
                    enabled: true,
                    rect: top_gnd,
                },
                top
            )
            const top_net = p.local_net(top.name, '')
            top.i = top.enabled ? top.index || top_net.index : null
            top.net = top.enabled ? top_net.str : null

            bottom = Object.assign(
                {
                    jumper,
                    pad: p.pads,
                    reg: false,
                    enabled: true,
                    rect: bottom_gnd,
                },
                bottom
            )
            const bottom_net = p.local_net(bottom.name, '')
            bottom.i = bottom.enabled ? bottom.index || bottom_net.index : null
            bottom.net = bottom.enabled ? bottom_net.str : null

            result.push(
                column(metrics, {
                    x: i * metrics.breakout.pin_spacing - w2,
                    rot: p.rot,
                    side: FRONT,
                    reversible,
                    jumper,
                    top,
                    bottom,
                })
            )
        }
        return `
    (module Parametric (layer F.Cu) (tedit 6135B927)
      ${p.at}

      ${'' /* footprint description, tags and reference */}
      (descr "${p.part} footprint")
      (fp_text reference "${p.ref}" (at -16.256 -0.254 ${p.rot + 90}) (layer F.SilkS) ${p.ref_hide}
        (effects (font (size 1 1) (thickness 0.15))))

      ${'' /* footprint reference */}
      (fp_text reference "${p.ref}" 
        (at ${-w2 - 2.5} 0 ${p.rot + 90})
        (layer Dwgs.User)
        (effects (font (size 1 1) (thickness 0.15))))
      (fp_text value "${p.part}" 
        (at ${-w2 - 4} 0 ${p.rot + 90})
        (layer F.Fab)
        (effects (font (size 1 1) (thickness 0.15))))

    ${flat_join(result)}
    )`
    },
}
