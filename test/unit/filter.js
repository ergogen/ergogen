const filter = require('../../src/filter').parse
const anchor = require('../../src/anchor').parse
const Point = require('../../src/point')

describe('Filter', function() {

    it('without points', function() {
        filter(undefined, '').should.deep.equal([new Point()])
        filter(true, '').should.deep.equal([])
        filter(false, '').should.deep.equal([])
        filter({}, '').should.deep.equal([anchor({}, '', points)()])
    })

    const points = {
        one: new Point(0, 1, 0, {name: 'one', tags: ['odd']}),
        two: new Point(0, 2, 0, {name: 'two', tags: ['even', 'prime']}),
        three: new Point(0, 3, 0, {name: 'three', tags: {odd: 'yes', prime: 'yupp'}}),
        mirror_one: new Point(0, 1, 0, {name: 'mirror_one', tags: ['odd'], mirrored: true})
    }

    it('empty filter', function() {
        // an undefined config leads to a default point
        filter(undefined, '', points).should.deep.equal([new Point()])
        // true shouldn't filter anything, while false should filter everything
        filter(true, '', points).should.deep.equal(Object.values(points))
        filter(false, '', points).should.deep.equal([])
        // points should only be returned on their respective halves
        // - so `source` is every match
        filter(true, '', points, undefined, 'source').should.deep.equal(Object.values(points))
        // - `clone` is the mirror image of every match, which maps one to mirror_one, mirror_one to one, and two/three to nothing (as they don't have mirror parts)
        filter(true, '', points, undefined, 'clone').should.deep.equal([points.mirror_one, points.one])
        // - and `both` is every match plus its mirror image as well
        filter(true, '', points, undefined, 'both').should.deep.equal(Object.values(points))
        // objects just propagate to anchor (and then wrap in array for consistency)
        filter({}, '', points).should.deep.equal([anchor({}, '', points)()])
        filter({}, '', points, undefined, 'source').should.deep.equal([anchor({}, '', points)()])
        filter({}, '', points, undefined, 'clone').should.deep.equal([anchor({}, '', points)()])
        filter({}, '', points, undefined, 'both').should.deep.equal([anchor({}, '', points)()])
    })

    const names = points => points.map(p => p.meta.name)
    
    it('similar', function() {
        // simple name string
        names(filter('one', '', points)).should.deep.equal(['one'])
        // simple name regex
        names(filter('/^t/', '', points)).should.deep.equal(['two', 'three'])
        // tags should count, too (one and mirror_one for the name, three for the odd tag)
        names(filter('/^o/', '', points)).should.deep.equal(['one', 'three', 'mirror_one'])
        // middle spec, should be the same as above, only explicit
        names(filter('~ /^o/', '', points)).should.deep.equal(['one', 'three', 'mirror_one'])
        // full spec (/n/ would normally match both "one" and "even", but on the tags level, it's just even)
        names(filter('meta.tags ~ /n/', '', points)).should.deep.equal(['two'])
        names(filter('meta.name,meta.tags ~ /n/', '', points)).should.deep.equal(['one', 'two', 'mirror_one'])
        // negation
        names(filter('meta.tags ~ -/n/', '', points)).should.deep.equal(['one', 'three', 'mirror_one'])
        names(filter('meta.name,meta.tags ~ -/n/', '', points)).should.deep.equal(['three'])
        // arrays OR by default at odd levels (including top level)...
        names(filter(['one', 'two'], '', points)).should.deep.equal(['one', 'two'])
        // ...and AND at even levels
        names(filter([['even', 'prime']], '', points)).should.deep.equal(['two'])
        // arbitrary nesting should be possible
        names(filter([[['even', 'odd'], 'prime']], '', points)).should.deep.equal(['two', 'three'])
        // invalid regexes should throw meaningful errors
        filter.bind(this, '/\\/', '', points).should.throw('Invalid regex')
        // anything other than string/array/object/undefined is also an error
        filter.bind(this, 28, '', points).should.throw('Unexpected type')
    })

})
