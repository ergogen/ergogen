function collect_paths(model, offset = [0, 0]) {
    if (!model) return []
    const paths = []
    const ox = ((model.origin && model.origin[0]) || 0) + offset[0]
    const oy = ((model.origin && model.origin[1]) || 0) + offset[1]
    if (model.paths) {
        for (const [name, p] of Object.entries(model.paths)) {
            paths.push({ ...p, _ox: ox, _oy: oy, _name: name })
        }
    }
    if (model.models) {
        for (const [, sub] of Object.entries(model.models)) {
            paths.push(...collect_paths(sub, [ox, oy]))
        }
    }
    return paths
}

function collect_model(key, outline) {
    const models = outline.models || {}
    if (!models[key]) return []
    return collect_paths(models[key], [
        (outline.origin && outline.origin[0]) || 0,
        (outline.origin && outline.origin[1]) || 0
    ])
}

function outline_has_ab(outline) {
    return outline.models && 'a' in outline.models && 'b' in outline.models
}

function paths_are_circles(paths) {
    return paths.length > 0 && paths.every(p => p.type === 'circle')
}

function arc_start(p) {
    const ox = p._ox + ((p.origin && p.origin[0]) || 0)
    const oy = p._oy + ((p.origin && p.origin[1]) || 0)
    const a = p.startAngle * Math.PI / 180
    return [ox + p.radius * Math.cos(a), oy + p.radius * Math.sin(a)]
}

function arc_end(p) {
    const ox = p._ox + ((p.origin && p.origin[0]) || 0)
    const oy = p._oy + ((p.origin && p.origin[1]) || 0)
    let ea = p.endAngle
    while (ea < p.startAngle) ea += 360
    const a = ea * Math.PI / 180
    return [ox + p.radius * Math.cos(a), oy + p.radius * Math.sin(a)]
}

function line_start(p) {
    return [p._ox + ((p.origin && p.origin[0]) || 0), p._oy + ((p.origin && p.origin[1]) || 0)]
}

function line_end(p) {
    return [p._ox + ((p.end && p.end[0]) || 0), p._oy + ((p.end && p.end[1]) || 0)]
}

function circle_center(p) {
    return [p._ox + ((p.origin && p.origin[0]) || 0), p._oy + ((p.origin && p.origin[1]) || 0)]
}

function path_endpoints(p) {
    if (p.type === 'arc') return [arc_start(p), arc_end(p)]
    if (p.type === 'line') return [line_start(p), line_end(p)]
    return null
}

function pt_dist(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

function build_chains(paths) {
    const circles = paths.filter(p => p.type === 'circle')
    const segments = paths.filter(p => p.type !== 'circle')
    if (segments.length === 0) return { chains: [], circles }

    const remaining = segments.map(p => ({ p }))
    const chains = []

    while (remaining.length > 0) {
        const chain = [{ ...remaining.shift(), reversed: false }]
        let changed = true
        while (changed) {
            changed = false
            const last = chain[chain.length - 1]
            const lastEps = path_endpoints(last.p)
            const tailPt = last.reversed ? lastEps[0] : lastEps[1]

            let bestIdx = -1, bestDist = Infinity, bestReversed = false
            for (let i = 0; i < remaining.length; i++) {
                const [s, e] = path_endpoints(remaining[i].p)
                const ds = pt_dist(tailPt, s)
                const de = pt_dist(tailPt, e)
                if (ds < bestDist) { bestDist = ds; bestIdx = i; bestReversed = false }
                if (de < bestDist) { bestDist = de; bestIdx = i; bestReversed = true }
            }

            if (bestIdx >= 0 && bestDist < 0.1) {
                chain.push({ p: remaining[bestIdx].p, reversed: bestReversed })
                remaining.splice(bestIdx, 1)
                changed = true
            }
        }
        chains.push(chain)
    }

    return { chains, circles }
}

function fmt(n) { return n.toFixed(6) }

function safe_name(name) {
    return name.replace(/[^a-zA-Z0-9_]/g, '_')
}

function py_tuple(values) {
    return `(${values.join(', ')})`
}

function chain_to_py_edges(chain, varname = 'edges') {
    const lines = []
    const segments = []
    const SNAP_EPS = 0.1

    for (const { p, reversed } of chain) {
        if (p.type === 'line') {
            const [s, e] = [line_start(p), line_end(p)]
            const [from, to] = reversed ? [e, s] : [s, e]
            segments.push({ type: 'line', from, to })
        } else if (p.type === 'arc') {
            const ox = p._ox + ((p.origin && p.origin[0]) || 0)
            const oy = p._oy + ((p.origin && p.origin[1]) || 0)
            const r = p.radius
            let sa = p.startAngle
            let ea = p.endAngle
            while (ea < sa) ea += 360
            const span = ea - sa
            const splits = span >= 180 ? [sa, sa + span / 2, ea] : [sa, ea]
            if (reversed) splits.reverse()

            for (let i = 0; i < splits.length - 1; i++) {
                const a1 = splits[i]
                const a2 = splits[i + 1]
                const mid = (a1 + a2) / 2
                const p1 = [ox + r * Math.cos(a1 * Math.PI / 180), oy + r * Math.sin(a1 * Math.PI / 180)]
                const p2 = [ox + r * Math.cos(mid * Math.PI / 180), oy + r * Math.sin(mid * Math.PI / 180)]
                const p3 = [ox + r * Math.cos(a2 * Math.PI / 180), oy + r * Math.sin(a2 * Math.PI / 180)]
                segments.push({ type: 'arc', p1, p2, p3 })
            }
        }
    }

    if (segments.length > 1) {
        for (let i = 0; i < segments.length - 1; i++) {
            const curr = segments[i]
            const next = segments[i + 1]
            const currEnd = curr.type === 'line' ? curr.to : curr.p3
            const nextStart = next.type === 'line' ? next.from : next.p1

            if (pt_dist(currEnd, nextStart) <= SNAP_EPS) {
                if (curr.type === 'line') {
                    curr.to = nextStart
                } else if (next.type === 'line') {
                    next.from = currEnd
                } else {
                    next.p1 = currEnd
                }
            }
        }

        const first = segments[0]
        const last = segments[segments.length - 1]
        const firstStart = first.type === 'line' ? first.from : first.p1
        const lastEnd = last.type === 'line' ? last.to : last.p3
        if (pt_dist(lastEnd, firstStart) <= SNAP_EPS) {
            if (last.type === 'line') {
                last.to = firstStart
            } else if (first.type === 'line') {
                first.from = lastEnd
            } else {
                first.p1 = lastEnd
            }
        }
    }

    for (const seg of segments) {
        if (seg.type === 'line') {
            lines.push(`    ${varname}.append(cq.Edge.makeLine(`)
            lines.push(`        cq.Vector(${fmt(seg.from[0])}, ${fmt(seg.from[1])}, 0),`)
            lines.push(`        cq.Vector(${fmt(seg.to[0])}, ${fmt(seg.to[1])}, 0)`)
            lines.push(`    ))`)
        } else {
            lines.push(`    ${varname}.append(cq.Edge.makeThreePointArc(`)
            lines.push(`        cq.Vector(${fmt(seg.p1[0])}, ${fmt(seg.p1[1])}, 0),`)
            lines.push(`        cq.Vector(${fmt(seg.p2[0])}, ${fmt(seg.p2[1])}, 0),`)
            lines.push(`        cq.Vector(${fmt(seg.p3[0])}, ${fmt(seg.p3[1])}, 0)`)
            lines.push(`    ))`)
        }
    }
    return lines
}

function transform_lines(shift, rotate, varname = 'result') {
    const lines = []
    if (shift[0] || shift[1] || shift[2]) {
        lines.push(`    ${varname} = ${varname}.translate(${py_tuple(shift)})`)
    }
    if (rotate[0]) lines.push(`    ${varname} = ${varname}.rotate((0,0,0),(1,0,0),${rotate[0]})`)
    if (rotate[1]) lines.push(`    ${varname} = ${varname}.rotate((0,0,0),(0,1,0),${rotate[1]})`)
    if (rotate[2]) lines.push(`    ${varname} = ${varname}.rotate((0,0,0),(0,0,1),${rotate[2]})`)
    return lines
}

function paths_to_fn(name, paths, extrude, shift, rotate) {
    const { chains, circles } = build_chains(paths)
    const lines = []

    lines.push(`def ${name}():`)

    if (chains.length === 0 && circles.length === 0) {
        lines.push(`    result = cq.Workplane("XY")`)
        lines.push(`    return result`)
        lines.push(``)
        return lines.join('\n')
    }

    if (circles.length > 0 && chains.length === 0) {
        lines.push(`    result = None`)
        for (const p of circles) {
            const [cx, cy] = circle_center(p)
            lines.push(`    _s = cq.Workplane("XY").moveTo(${fmt(cx)}, ${fmt(cy)}).circle(${fmt(p.radius)}).extrude(${extrude})`)
            lines.push(`    result = _s if result is None else result.union(_s)`)
        }
    } else {
        const sorted_chains = chains.sort((a, b) => b.length - a.length)

        for (let ci = 0; ci < sorted_chains.length; ci++) {
            const vname = ci === 0 ? 'edges' : `edges_${ci}`
            lines.push(`    ${vname} = []`)
            lines.push(...chain_to_py_edges(sorted_chains[ci], vname))
            lines.push(`    _wire_${ci} = cq.Wire.assembleEdges(${vname})`)
            lines.push(`    _face_${ci} = cq.Face.makeFromWires(_wire_${ci})`)
            lines.push(`    _solid_${ci} = cq.Solid.extrudeLinear(_face_${ci}, cq.Vector(0, 0, ${extrude}))`)
            if (ci === 0) {
                lines.push(`    result = cq.Workplane("XY").add(_solid_0)`)
            } else {
                lines.push(`    result = result.union(cq.Workplane("XY").add(_solid_${ci}))`)
            }
        }

        for (const p of circles) {
            const [cx, cy] = circle_center(p)
            lines.push(`    result = result.cut(cq.Workplane("XY").moveTo(${fmt(cx)}, ${fmt(cy)}).circle(${fmt(p.radius)}).extrude(${extrude}))`)
        }
    }

    lines.push(...transform_lines(shift, rotate))
    lines.push(`    return result`)
    lines.push(``)
    return lines.join('\n')
}

function case_fn_name(case_name) {
    return `make_case_${safe_name(case_name)}`
}

function op_name(operation) {
    return operation === 'subtract' ? 'cut' : operation === 'intersect' ? 'intersect' : 'union'
}

function fillet_lines(varname, fillet) {
    const outer_top = (fillet && fillet.outer && fillet.outer.top) || 0
    const outer_bottom = (fillet && fillet.outer && fillet.outer.bottom) || 0
    const inner_top = (fillet && fillet.inner && fillet.inner.top) || 0
    const inner_bottom = (fillet && fillet.inner && fillet.inner.bottom) || 0
    if (!outer_top && !outer_bottom && !inner_top && !inner_bottom) return []
    return [`    ${varname} = _fillet_edges(${varname}, "${varname}", ${outer_top}, ${outer_bottom}, ${inner_top}, ${inner_bottom})`]
}

function chamfer_lines(varname, chamfer) {
    const outer_top = (chamfer && chamfer.outer && chamfer.outer.top) || 0
    const outer_bottom = (chamfer && chamfer.outer && chamfer.outer.bottom) || 0
    const inner_top = (chamfer && chamfer.inner && chamfer.inner.top) || 0
    const inner_bottom = (chamfer && chamfer.inner && chamfer.inner.bottom) || 0
    if (!outer_top && !outer_bottom && !inner_top && !inner_bottom) return []
    return [`    ${varname} = _chamfer_edges(${varname}, "${varname}", ${outer_top}, ${outer_bottom}, ${inner_top}, ${inner_bottom})`]
}

function generate_py(case_name, cases) {
    const out = []
    const emitted_cases = new Set()
    const emitted_parts = new Set()

    out.push(`# Auto-generated by Ergogen`)
    out.push(`# Case: ${case_name}`)
    out.push(``)
    out.push(`import cadquery as cq`)
    out.push(`import math`)
    out.push(`import pathlib`)
    out.push(``)
    out.push(`def _outer_wire_edges(result, selector):`)
    out.push(`    edges = []`)
    out.push(`    for face in result.faces(selector).vals():`)
    out.push(`        edges.extend(face.outerWire().Edges())`)
    out.push(`    return edges`)
    out.push(``)
    out.push(`def _inner_wire_edges(result, selector):`)
    out.push(`    edges = []`)
    out.push(`    for face in result.faces(selector).vals():`)
    out.push(`        for wire in face.innerWires():`)
    out.push(`            edges.extend(wire.Edges())`)
    out.push(`    return edges`)
    out.push(``)
    out.push(`def _apply_edge_treatment(result, part_name, operation_name, operation, outer_top=0, outer_bottom=0, inner_top=0, inner_bottom=0):`)
    out.push(`    for selector, outer_value, inner_value in (("<Z", outer_bottom, inner_bottom), (">Z", outer_top, inner_top)):`)
    out.push(`        if outer_value:`)
    out.push(`            edges = _outer_wire_edges(result, selector)`)
    out.push(`            if edges:`)
    out.push(`                try:`)
    out.push(`                    result = operation(result.newObject(edges), outer_value)`)
    out.push(`                except Exception as exc:`)
    out.push(`                    raise RuntimeError(f"{operation_name} failed on {part_name} outer {selector} edges with value {outer_value}") from exc`)
    out.push(`        if inner_value:`)
    out.push(`            edges = _inner_wire_edges(result, selector)`)
    out.push(`            if edges:`)
    out.push(`                try:`)
    out.push(`                    result = operation(result.newObject(edges), inner_value)`)
    out.push(`                except Exception as exc:`)
    out.push(`                    raise RuntimeError(f"{operation_name} failed on {part_name} inner {selector} edges with value {inner_value}") from exc`)
    out.push(`    return result`)
    out.push(``)
    out.push(`def _fillet_edges(result, part_name, outer_top=0, outer_bottom=0, inner_top=0, inner_bottom=0):`)
    out.push(`    return _apply_edge_treatment(result, part_name, "fillet", lambda edges, value: edges.fillet(value), outer_top, outer_bottom, inner_top, inner_bottom)`)
    out.push(``)
    out.push(`def _chamfer_edges(result, part_name, outer_top=0, outer_bottom=0, inner_top=0, inner_bottom=0):`)
    out.push(`    return _apply_edge_treatment(result, part_name, "chamfer", lambda edges, value: edges.chamfer(value), outer_top, outer_bottom, inner_top, inner_bottom)`)
    out.push(``)

    function emit_part(case_name, part, index) {
        const prefix = `make_part_${safe_name(case_name)}_${index}_${safe_name(part.name)}`
        if (emitted_parts.has(prefix)) return prefix
        emitted_parts.add(prefix)

        const outline = part.outline
        const shift = part.shift || [0, 0, 0]
        const rotate = part.rotate || [0, 0, 0]

        if (outline_has_ab(outline)) {
            const paths_a = collect_model('a', outline)
            const paths_b = collect_model('b', outline)
            const a_empty = paths_a.length === 0
            const b_empty = paths_b.length === 0

            out.push(paths_to_fn(`${prefix}_a`, paths_a, part.extrude, [0, 0, 0], [0, 0, 0]))
            out.push(paths_to_fn(`${prefix}_b`, paths_b, part.extrude, [0, 0, 0], [0, 0, 0]))
            out.push(`def ${prefix}():`)
            if (a_empty && b_empty) {
                out.push(`    result = cq.Workplane("XY")`)
            } else if (a_empty) {
                out.push(`    result = ${prefix}_b()`)
            } else if (b_empty) {
                out.push(`    result = ${prefix}_a()`)
            } else if (paths_are_circles(paths_a) && paths_are_circles(paths_b)) {
                out.push(`    a = ${prefix}_a()`)
                out.push(`    b = ${prefix}_b()`)
                out.push(`    result = a.union(b)`)
            } else {
                out.push(`    a = ${prefix}_a()`)
                out.push(`    b = ${prefix}_b()`)
                out.push(`    result = a.cut(b)`)
            }
            out.push(...transform_lines(shift, rotate))
            out.push(`    return result`)
            out.push(``)
        } else {
            out.push(paths_to_fn(prefix, collect_paths(outline), part.extrude, shift, rotate))
        }

        return prefix
    }

    function emit_case(name) {
        if (emitted_cases.has(name)) return
        const parts = cases[name]
        if (!parts) throw new Error(`Case "${name}" does not exist`)

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            if (part.what === 'case') emit_case(part.name)
            if (part.what === 'outline') emit_part(name, part, i)
        }

        emitted_cases.add(name)
        out.push(`def ${case_fn_name(name)}():`)
        let first = true
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            const fn = part.what === 'case' ? case_fn_name(part.name) : emit_part(name, part, i)
            const tmp = `_part_${i}`
            out.push(`    ${tmp} = ${fn}()`)
            out.push(...transform_lines(part.what === 'case' ? (part.shift || [0, 0, 0]) : [0, 0, 0], part.what === 'case' ? (part.rotate || [0, 0, 0]) : [0, 0, 0], tmp))
            out.push(...fillet_lines(tmp, part.fillet))
            out.push(...chamfer_lines(tmp, part.chamfer))
            if (first) {
                out.push(`    result = ${tmp}`)
                first = false
            } else {
                out.push(`    result = result.${op_name(part.operation)}(${tmp})`)
            }
        }
        if (first) out.push(`    result = cq.Workplane("XY")`)
        out.push(`    return result`)
        out.push(``)
    }

    emit_case(case_name)

    out.push(`def make_case():`)
    out.push(`    return ${case_fn_name(case_name)}()`)
    out.push(``)
    out.push(``)
    out.push(`if __name__ == "__main__":`)
    out.push(`    result = make_case()`)
    out.push(`    output_dir = pathlib.Path(__file__).resolve().parent`)
    out.push(`    cq.exporters.export(result, str(output_dir / "${case_name}.step"))`)
    out.push(`    cq.exporters.export(result, str(output_dir / "${case_name}.stl"))`)
    out.push(`    print("Done.")`)

    return out.join('\n')
}

module.exports = {
    generate_py
}
