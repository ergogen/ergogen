import m, { IModel, IPoint } from 'makerjs'
import * as u from './utils.js'
import { Column } from './column.js'
import { Row } from './row.js'

type PointMetadata = {
    name?: string
    width?: number
    height?: number
    col?: Column
    row?: Row
    colrow?: string
    bind?: unknown
    autobind?: boolean
    skip?: boolean
    mirrored?: boolean
    asym?: unknown
}

export default class Point {
    x: number
    y: number
    r: number

    meta: PointMetadata

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

    get p(): [number, number] {
        return [this.x, this.y]
    }

    set p(val: IPoint) {
        [this.x, this.y] = val as [number, number]
    }

    shift(s: IPoint, relative=true, resist=false): Point {
        s[0] *= (!resist && this.meta.mirrored) ? -1 : 1
        if (relative) {
            s = m.point.rotate(s, this.r)
        }
        this.x += s[0]
        this.y += s[1]
        return this
    }

    rotate(angle: number, origin=[0, 0], resist=false): Point {
        angle *= (!resist && this.meta.mirrored) ? -1 : 1
        if (origin) {
            this.p = m.point.rotate(this.p, angle, origin)
        }
        this.r += angle
        return this
    }

    mirror(x: number): Point {
        this.x = 2 * x - this.x
        this.r = -this.r
        return this
    }

    clone(): Point {
        return new Point(
            this.x,
            this.y,
            this.r,
            u.deepcopy(this.meta)
        )
    }

    position(model: IModel): IModel {
        return m.model.moveRelative(m.model.rotate(model, this.r), this.p)
    }

    unposition(model: IModel): IModel {
        return m.model.rotate(m.model.moveRelative(model, [-this.x, -this.y]), -this.r)
    }

    rect(size=14): IModel {
        let rect = u.rect(size, size, [-size/2, -size/2])
        return this.position(rect)
    }

    angle(other: Point): number {
        const dx = other.x - this.x
        const dy = other.y - this.y
        return -Math.atan2(dx, dy) * (180 / Math.PI)
    }

    equals(other: Point): boolean {
        return this.x === other.x
            && this.y === other.y
            && this.r === other.r
            && JSON.stringify(this.meta) === JSON.stringify(other.meta)
    }
}
