import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
export const expect = chai.expect
export const should = chai.should()
import sinon from 'sinon'

// Restore the default sandbox after every test
export const mochaHooks = {
    afterEach() {
        sinon.restore()
    }
}