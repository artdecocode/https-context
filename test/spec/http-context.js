import { equal, ok } from 'zoroaster/assert'
import rqt from 'rqt'
import { HTTPContext } from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: HTTPContext,
  async 'starts the context'({ url }) {
    ok(url)
  },
  async 'responds to the message'({ url }) {
    const res = await rqt(url)
    equal(res, 'OK')
  },
}

export default T
