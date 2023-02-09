const m = require('makerjs')
const u = require('./utils')

module.exports = class Point {
    constructor(x=0, y=0, r=0, meta={}) {
        if (Array.isArray(x)) {
            this.x = x[0]
            this.y = x[1]
            this.r = 0
            this.meta = {}
        } else {
            this.x = x
            this.y = y
            this.r = r
            this.meta = meta
        }
    }

    get p() {
        return [this.x, this.y]
    }

    set p(val) {
        [this.x, this.y] = val
    }

    shift(s, relative=true, resist=false) {
        s[0] *= (!resist && this.meta.mirrored) ? -1 : 1
        if (relative) {
            s = m.point.rotate(s, this.r)
        }
        this.x += s[0]
        this.y += s[1]
        return this
    }

    rotate(angle, origin=[0, 0], resist=false) {
        angle *= (!resist && this.meta.mirrored) ? -1 : 1
        if (origin) {
            this.p = m.point.rotate(this.p, angle, origin)
        }
        this.r += angle
        return this
    }

    mirror(x) {
        this.x = 2 * x - this.x
        this.r = -this.r
        return this
    }

    clone() {
        return new Point(
            this.x,
            this.y,
            this.r,
            u.deepcopy(this.meta)
        )
    }

    position(model) {
        return m.model.moveRelative(m.model.rotate(model, this.r), this.p)
    }

    unposition(model) {
        return m.model.rotate(m.model.moveRelative(model, [-this.x, -this.y]), -this.r)
    }

    rect(size=14) {
        let rect = u.rect(size, size, [-size/2, -size/2])
        return this.position(rect)
    }

    angle(other) {
        const dx = other.x - this.x
        const dy = other.y - this.y
        return -Math.atan2(dx, dy) * (180 / Math.PI)
    }

    equals(other) {
        return this.x === other.x
            && this.y === other.y
            && this.r === other.r
            && JSON.stringify(this.meta) === JSON.stringify(other.meta)
    }
}
