import { equal, ok } from 'zoroaster/assert'
import rqt from 'rqt'
import { HTTPContext } from '../../src'

/** @type {Object.<string, (c: HTTPContext)>} */
const T = {
  context: HTTPContext,
  async 'starts the context'({ url }) {
    ok(url)
  },
  async 'responds to the message'({ url, response }) {
    const res = await rqt(url)
    equal(res, response)
  },
}

export default T
