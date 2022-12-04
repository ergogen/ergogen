const m = require('makerjs')
const Point = require('../../src/point')
const {check} = require('../helpers/point')

describe('Point', function() {

    it('construction', function() {
        // increasingly verbose parametrization
        check(new Point(), [0, 0, 0, {}])
        check(new Point(1), [1, 0, 0, {}])
        check(new Point(1, 2), [1, 2, 0, {}])
        check(new Point(1, 2, 3), [1, 2, 3, {}])
        check(new Point(1, 2, 3, {arst: 'neio'}), [1, 2, 3, {arst: 'neio'}])
        // point-like instantiation
        check(new Point([1, 2]), [1, 2, 0, {}])
    })

    it('access', function() {
        // getting and setting through the virtual `p` field
        const p = new Point(1, 2)
        p.p.should.deep.equal([1, 2])
        p.p = [3, 4]
        p.p.should.deep.equal([3, 4])
    })

    it('cloning', function() {
        const p = new Point(1, 2)
        const clone = p.clone()
        // make sure cloning works
        check(clone, [1, 2, 0, {}])
        clone.p = [3, 4]
        // and make sure it's then independent of the original
        check(p, [1, 2, 0, {}])
        check(clone, [3, 4, 0, {}])
    })

    it('shifting', function() {
        const p = new Point(0, 0, -90) // at origin, "looking right"
        // non-relative shift up and left, should be up and left
        check(p.clone().shift([-1, 1], false), [-1, 1, -90, {}])
        // relative shift up and left, should be up and right
        check(p.clone().shift([-1, 1]), [1, 1, -90, {}])
    })

    it('rotation', function() {
        const p = new Point(0, 1, 0) // above origin, "looking up"
        // around default origin
        check(p.clone().rotate(-90), [1, 0, -90, {}])
        // around custom origin
        check(p.clone().rotate(-90, [1, 1]), [1, 2, -90, {}])
    })

    it('resistance', function() {
        const p = new Point(0, 0, 0, {mirrored: true}) // origin, but mirrored
        // non-relative shift up and left, mirroring changes it to up and right
        check(p.clone().shift([-1, 1], false), [1, 1, 0, {mirrored: true}])
        // ...but resistance keeps it up and left
        check(p.clone().shift([-1, 1], false, true), [-1, 1, 0, {mirrored: true}])
        
        // mirroring changes rotation direction, too
        check(p.clone().rotate(-90), [0, 0, 90, {mirrored: true}])
        // ...but not when resistance is applied
        check(p.clone().rotate(-90, false, true), [0, 0, -90, {mirrored: true}])
    })

    it('mirroring', function() {
        const p = new Point(0, 1, 0)
        // make sure mirroring inverts rotation, as well as positions correctly
        check((new Point(-1, 0, 10)).mirror(0), [1, 0, -10, {}])
    })

    it('positioning', function() {
        const p = new Point(1, 1, -90) // above origin, "looking right"
        const model = {
            paths: {
                line: new m.paths.Line([0, 0], [0, 1]),
            }
        }
        // it's both rotated and shifted to the correct position
        p.position(model).should.deep.equal({
            paths: {
                line: {
                    type: 'line',
                    origin: [0, 0],
                    end: [1, 0]
                }
            },
            origin: [1, 1]
        })
        // `rect` does the same, only with built-in rectangles
        const expected_rect = {
            origin: [-6, -6],
            paths: {
                bottom: {
                    end: [0, 14],
                    origin: [0, 0],
                    type: 'line'
                },
                left: {
                    end: [14, 14],
                    origin: [0, 14],
                    type: 'line'
                },
                right: {
                    end: [0, 0],
                    origin: [14, 0],
                    type: 'line'
                },
                top: {
                    end: [14, 0],
                    origin: [14, 14],
                    type: 'line'
                }
            }
        }          
        p.rect(14).should.deep.equal(expected_rect)
        // default size is 14 for keyboard hole reasons
        p.rect().should.deep.equal(expected_rect)
    })
})