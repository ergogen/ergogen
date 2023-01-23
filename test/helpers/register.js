global.chai = require('chai')
global.chai.use(require('chai-as-promised'))
global.expect = global.chai.expect
global.should = global.chai.should()
global.sinon = require('sinon')

// Restore the default sandbox after every test
exports.mochaHooks = {
    afterEach() {
        sinon.restore()
    }
}