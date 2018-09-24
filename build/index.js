const { createServer } = require('http');
const { debuglog } = require('util');
const { Socket } = require('net') // eslint-disable-line no-unused-vars
let Catchment = require('catchment'); if (Catchment && Catchment.__esModule) Catchment = Catchment.default;

const LOG = debuglog('https-context')

       class HTTPContext {
  /**
   * @constructor
   * A Zoroaster test context that sets up an HTTP server ready for connections.
   * @param {Config} config Configuration object.
   * @param {string} config.type The type.
   * @example
   *
   * import { equal } from 'assert'
   * import { HTTPContext } from 'https-context'
   * import req from '../../src'
   * import Context from '../context'
   *
   * const T = {
   *  context: [Context, HTTPContext],
   *  async 'make request'({ readFixture }, { url }) {
   *   const expected = await readFixture()
   *   const r = await req(url)
   *   equal(expected, r)
   *  },
   * }
   */
  constructor() {
    this.called = 0
    this._response = 'OK'
    this.headers = {}

    this.state = {
      called: 0,
      headers: {},
      postData: null,
    }
  }

  get response() {
    return this._response
  }
  getState() {
    return this.state
  }
  setResponse(data) {
    this._response = data
  }
  setHeaders(headers) {
    this.headers = headers
  }
  /**
   * Set the content type for the response.
   * @param {string} contentType The response content type.
   */
  setContentType(contentType) {
    this.contentType = contentType
  }
  async _init() {
    const server = createServer(this.handler.bind(this))
    this.server = server
    /** @type {Object.<string, Socket>} */
    this.connections = {}

    this.server.on('connection', (con) => {
      const key = con.remoteAddress + ':' + con.remotePort
      this.connections[key] = con
      con.on('close', () => {
        delete this.connections[key]
      })
    })
    await new Promise((resolve) => {
      this.server.listen(undefined, 'localhost', resolve)
    })
    this.address = server.address()
  }
  /** Returns address of the server
   * @example
   *
   * `http://127.0.0.1:59292`
   */
  get url() {
    if (!this.address) return null
    return `http://${this.host}`
  }
  /** Returns host of the server
   * @example
   *
   * `127.0.0.1:59292`
   */
  get host() {
    if (!this.address) return null
    return `${this.address.address}:${this.address.port}`
  }
  async _destroy() {
    await new Promise(async (resolve) => {
      await Object.keys(this.connections).reduce(async (a, key) => {
        await a
        const c = this.connections[key]
        const p = new Promise((r) => {
          c.on('close', () => {
            LOG('socket closed')
            r()
          })
        })
        c.destroy()
        await p
      }, {})
      this.server.close(resolve)
      // this.server.on('close', resolve)
    })
  }
  async handler(req, res) {
    this.state.called += 1
    this.state.headers = req.headers

    res.writeHead(200, { 'Content-Type': this.contentType || 'text/plain', ...this.headers })

    if (req.method != 'GET') {
      const catchment = new Catchment
      req.pipe(catchment)
      const { promise } = catchment
      const postData = await promise
      this.state.postData = postData
    }

    res.end(this._response)
  }
}


module.exports.HTTPContext = HTTPContext
//# sourceMappingURL=index.js.map