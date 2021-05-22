exports.check = (point, expected=[]) => {
    point.x.should.equal(expected[0] || 0)
    point.y.should.equal(expected[1] || 0)
    point.r.should.equal(expected[2] || 0)
    point.meta.should.deep.equal(expected[3] || {})
}