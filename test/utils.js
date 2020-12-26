const u = require('../src/utils')

describe('Utils', function() {
    it('deep_assign', function() {
        u.deep_assign({}, 'a.b.c', 1).should.deep.equal({a: {b: {c: 1}}})
    })
})