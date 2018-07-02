import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import httpsContext from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof httpsContext, 'function')
  },
  async 'calls package without error'() {
    await httpsContext()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await httpsContext({
      type: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T
