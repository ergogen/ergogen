const {parse} = require('../../src/anchor')
const Point = require('../../src/point')
const {check} = require('../helpers/point')

describe('Anchor', function() {

    const points = {
        o: new Point(0, 0, 0, {label: 'o'}),
        ten: new Point(10, 10, 10, {label: 'ten'}),
        mirror: new Point(20, 0, 0, {mirrored: true})
    }

    it('params', function() {
        // an empty anchor definition leads to the default point
        check(
            parse({}, 'name')(),
            [0, 0, 0, {}]
        )
        // unexpected check can be disabled
        check(
            parse({unexpected_key: true}, 'name', {}, false)(),
            [0, 0, 0, {}]
        )
        // default point can be overridden
        check(
            parse({}, 'name', {}, true, new Point(1, 1))(),
            [1, 1, 0, {}]
        )
    })

    it('ref', function() {
        // single reference
        check(
            parse({ref: 'o'}, 'name', points)(),
            [0, 0, 0, {label: 'o'}]
        )
        // average of multiple references (metadata gets ignored)
        check(
            parse({ref: ['o', 'ten']}, 'name', points)(),
            [5, 5, 5, {}]
        )
    })

    it('shift', function() {
        // normal shift
        check(
            parse({shift: [1, 1]}, 'name')(),
            [1, 1, 0, {}]
        )
        // shift should respect mirrored points (and invert along the x axis)
        check(
            parse({ref: 'mirror', shift: [1, 1]}, 'name', points)(),
            [19, 1, 0, {mirrored: true}]
        )
    })

    it('orient', function() {
        // an orient by itself is equal to rotation
        check(
            parse({orient: 10}, 'name')(),
            [0, 0, 10, {}]
        )
        // orient acts before shifting
        // so when we orient to the right, an upward shift goes to the right
        check(
            parse({orient: -90, shift: [0, 1]}, 'name')(),
            [1, 0, -90, {}]
        )
    })

    it('rotate', function() {
        // basic rotation
        check(
            parse({rotate: 10}, 'name')(),
            [0, 0, 10, {}]
        )
        // rotate acts *after* shifting
        // so even tho we rotate to the right, an upward shift does go upward
        check(
            parse({shift: [0, 1], rotate: -90}, 'name')(),
            [0, 1, -90, {}]
        )
    })

    it('affect', function() {
        // affect can restrict which point fields (x, y, r) are affected by the transformations
        check(
            parse({orient: -90, shift: [0, 1], rotate: 10, affect: 'r'}, 'name')(),
            [0, 0, -80, {}]
        )
        check(
            parse({orient: -90, shift: [0, 1], rotate: 10, affect: 'xy'}, 'name')(),
            [1, 0, 0, {}]
        )
        // affects can also be arrays (example same as above)
        check(
            parse({orient: -90, shift: [0, 1], rotate: 10, affect: ['x', 'y']}, 'name')(),
            [1, 0, 0, {}]
        )
    })

    it('array', function() {
        // basic multi-anchor
        check(
            parse([
                {shift: [1, 1]},
                {rotate: 10}
            ], 'name')(),
            [1, 1, 10, {}]
        )
    })
})