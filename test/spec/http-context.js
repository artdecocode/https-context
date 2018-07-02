import { equal, ok, deepEqual } from 'zoroaster/assert'
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
  async 'sends headers'({ url, state, host }) {
    const headers = {
      'user-agent': 'node.js',
    }
    await rqt(url, {
      headers,
    })
    ok(state.called)
    deepEqual(state.headers, {
      host,
      connection: 'close',
      ...headers,
    })
  },
}

export default T
