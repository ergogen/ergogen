const Point = require('../src/point')

describe('Point', function() {
    it('#constructor', function() {
        const point = new Point(1, 2, 45)
        point.p.should.deep.equal([1, 2])
    })
})