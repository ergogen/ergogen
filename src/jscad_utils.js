// JSCAD v2 code generation utilities
// Converts MakerJS models to JSCAD v2 syntax

const m = require('makerjs')
const u = require('./utils')

/**
 * Converts a MakerJS chain to JSCAD v2 code
 * @param {*} chain - MakerJS chain object
 * @param {number} accuracy - decimal places for rounding
 * @returns {string} - JSCAD v2 code string
 */
const chainToJscadV2 = (chain, accuracy = 0.001) => {

    const round = (n) => Math.round(n / accuracy) * accuracy
    const roundPoint = (p) => [round(p[0]), round(p[1])]

    // Handle circles
    if (chain.links.length === 1 && chain.links[0].walkedPath.pathContext.type === m.pathType.Circle) {
        const circle = chain.links[0].walkedPath.pathContext
        const offset = chain.links[0].walkedPath.offset || [0, 0]
        const center = [
            round(circle.origin[0] + offset[0]),
            round(circle.origin[1] + offset[1])
        ]
        const radius = round(circle.radius)
        return `primitives.circle({center: [${center[0]}, ${center[1]}], radius: ${radius}})`
    }

    // Build point array for polygons/polylines
    const points = []
    let reverseTail = false

    for (let i = 0; i < chain.links.length; i++) {
        const link = chain.links[i]
        const pathContext = link.walkedPath.pathContext
        const offset = link.walkedPath.offset || [0, 0]

        if (i === 0) {
            // First link - add both endpoints
            if (pathContext.type === m.pathType.Arc) {
                const arc = pathContext
                if (link.reversed) {
                    reverseTail = true
                }
                // For arcs, approximate with line segments
                const segments = approximateArc(arc, offset, link.reversed, accuracy)
                points.push(...segments)
            } else if (pathContext.type === m.pathType.Line) {
                const endPoints = link.endPoints.map(p => roundPoint(p))
                if (link.reversed) {
                    points.push(endPoints[1], endPoints[0])
                } else {
                    points.push(endPoints[0], endPoints[1])
                }
            }
        } else {
            // Subsequent links - only add end point
            if (pathContext.type === m.pathType.Arc) {
                const arc = pathContext
                const reverse = (reverseTail !== link.reversed)
                const segments = approximateArc(arc, offset, reverse, accuracy)
                // Skip first point as it's already in the array
                points.push(...segments.slice(1))
            } else if (pathContext.type === m.pathType.Line) {
                const reverse = (reverseTail !== link.reversed)
                const endPoint = roundPoint(link.endPoints[reverse ? 0 : 1])
                points.push(endPoint)
            }
        }
    }

    // Remove last point if it's the same as the first (closed polygon)
    if (points.length > 1) {
        const first = points[0]
        const last = points[points.length - 1]
        if (first[0] === last[0] && first[1] === last[1]) {
            points.pop()
        }
    }

    // Format points array
    const pointsStr = points.map(p => `[${p[0]}, ${p[1]}]`).join(', ')
    return `primitives.polygon({points: [${pointsStr}]})`
}

/**
 * Approximate an arc with line segments
 * @param {*} arc - MakerJS arc object
 * @param {Array} offset - [x, y] offset
 * @param {boolean} reversed - whether to reverse direction
 * @param {number} accuracy - accuracy for calculations
 * @returns {Array} - array of [x, y] points
 */
const approximateArc = (arc, offset, reversed, accuracy) => {
    const round = (n) => Math.round(n / accuracy) * accuracy

    const startAngle = arc.startAngle
    const endAngle = m.angle.ofArcEnd(arc)
    const angleDiff = Math.abs(endAngle - startAngle)

    // Determine number of segments (roughly one segment per 10 degrees, min 4)
    const segments = Math.max(4, Math.ceil(angleDiff / 10))

    const points = []
    const center = [
        arc.origin[0] + offset[0],
        arc.origin[1] + offset[1]
    ]

    for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const angle = startAngle + (endAngle - startAngle) * t
        const radians = angle * Math.PI / 180
        const x = round(center[0] + arc.radius * Math.cos(radians))
        const y = round(center[1] + arc.radius * Math.sin(radians))
        points.push([x, y])
    }

    if (reversed) {
        points.reverse()
    }

    return points
}

/**
 * Convert MakerJS model to JSCAD v2 code for 2D shapes
 * @param {*} model - MakerJS model
 * @param {Object} options - conversion options
 * @returns {string} - JSCAD v2 code
 */
exports.modelToJscadV2 = (model, options = {}) => {
    const accuracy = options.accuracy || 0.001
    const functionName = options.functionName || 'main'
    const extrude = options.extrude
    const indent = options.indent || 0
    const indentStr = ' '.repeat(indent)

    // Find all chains in the model
    const positiveChains = []
    const negativeChains = []

    m.model.findChains(model, (chains, loose, layer) => {
        chains.forEach(chain => {
            // Check if this is a hole (keyhole) or positive shape
            // Holes are typically clockwise, positive shapes are counter-clockwise
            // For now, we'll treat all as positive and let boolean operations handle it
            if (chain.links && chain.links.length > 0) {
                positiveChains.push(chain)
            }
        })
    })

    if (positiveChains.length === 0) {
        return `${indentStr}function ${functionName}(){\n${indentStr}    return primitives.square({size: 1});\n${indentStr}}\n`
    }

    // Convert each chain to JSCAD code
    const shapes = positiveChains.map(chain => chainToJscadV2(chain, accuracy))

    // Filter out tiny artifact polygons that can cause boolean operation failures
    // Calculate approximate area for each chain and filter out very small ones
    const MIN_POLYGON_AREA = 0.1  // Square mm - polygons smaller than this are likely artifacts
    const filteredShapes = []

    for (let i = 0; i < positiveChains.length; i++) {
        const chain = positiveChains[i]
        const shape = shapes[i]

        // Calculate rough bounding box area as a proxy for polygon area
        const chainModel = m.chain.toNewModel(chain)
        const bounds = m.measure.modelExtents(chainModel)
        if (bounds && bounds.width && bounds.height) {
            const area = Math.abs(bounds.width * bounds.height)
            if (area >= MIN_POLYGON_AREA) {
                filteredShapes.push(shape)
            }
        } else {
            // If we can't calculate bounds, include it to be safe
            filteredShapes.push(shape)
        }
    }

    // Combine shapes with union
    let result2D
    if (filteredShapes.length === 0) {
        // If all shapes were filtered out, return a tiny square as fallback
        result2D = 'primitives.square({size: 1})'
    } else if (filteredShapes.length === 1) {
        result2D = filteredShapes[0]
    } else {
        // JSCAD v2 booleans.union() takes an array of geometries
        const shapesArray = filteredShapes.join(', ')
        result2D = `booleans.union(${shapesArray})`
    }

    // Extrude to 3D if needed
    let result3D
    if (extrude) {
        result3D = `extrusions.extrudeLinear({height: ${extrude}}, ${result2D})`
    } else {
        result3D = result2D
    }

    // Generate function
    const lines = [
        `${indentStr}function ${functionName}(){`,
        `${indentStr}    return ${result3D};`,
        `${indentStr}}`
    ]

    return lines.join('\n') + '\n'
}
