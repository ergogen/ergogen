const filter = require('../../src/filter').parse
const anchor = require('../../src/anchor').parse
const Point = require('../../src/point')

describe('Filter', function() {

    const points = {
        one: new Point(0, 1, 0, {name: 'one', tags: ['odd']}),
        two: new Point(0, 2, 0, {name: 'two', tags: ['even', 'prime']}),
        three: new Point(0, 3, 0, {name: 'three', tags: {odd: 'yes', prime: 'yupp'}})
    }

    const names = points => points.map(p => p.meta.name)

    it('similar', function() {
        // an undefined config leads to a default point
        filter(undefined, '', points).should.deep.equal([new Point()])
        // true shouldn't filter anything, while false should filter everything
        filter(true, '', points).should.deep.equal(Object.values(points))
        filter(false, '', points).should.deep.equal([])
        // objects just propagate to anchor (and then wrap in array for consistency)
        filter({}, '', points).should.deep.equal([anchor({}, '', points)()])
        // simple name string
        names(filter('one', '', points)).should.deep.equal(['one'])
        // simple name regex
        names(filter('/^t/', '', points)).should.deep.equal(['two', 'three'])
        // tags should count, too (one for the name, three for the odd tag)
        names(filter('/^o/', '', points)).should.deep.equal(['one', 'three'])
        // middle spec, should be the same as above, only explicit
        names(filter('~ /^o/', '', points)).should.deep.equal(['one', 'three'])
        // full spec (n would normally match both one and even, but on the tags level, it's just even)
        names(filter('meta.tags ~ /n/', '', points)).should.deep.equal(['two'])
        // negation
        names(filter('meta.tags ~ -/n/', '', points)).should.deep.equal(['one', 'three'])
        // arrays OR by default at odd levels levels (including top level)...
        names(filter(['one', 'two'], '', points)).should.deep.equal(['one', 'two'])
        // ...and AND at even levels
        names(filter([['even', 'prime']], '', points)).should.deep.equal(['two'])
        // arbitrary nesting should be possible
        names(filter([[['even', 'odd'], 'prime']], '', points)).should.deep.equal(['two', 'three'])
        // anything other than string/array/object/undefined is an error
        filter.bind(this, 28, '', points).should.throw('Unexpected type')
    })

})