# https-context

[![npm version](https://badge.fury.io/js/https-context.svg)](https://npmjs.org/package/https-context)

`https-context` is a Zoroaster test context that sets up an HTTP and self-signed HTTPS servers. It can be used in testing packages that make requests. A new server will be installed for each test case, and all connections open to the server will be closed in the destroy method. This ensures that every gets gets a unique http server to be tested against, which is automatically destroyed so that the developers don't need to worry about implementing the tear-down.

```sh
yarn add -E https-context
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [HTTP API](#http-api)
  * [`response(): string|buffer`](#response-stringbuffer)
  * [`host(): string`](#host-string)
  * [`url(): string`](#url-string)
  * [`setResponse(data: string|Buffer)`](#setresponsedata-stringbuffer-void)
  * [`setHeaders(headers: Object)`](#setheadersheaders-object-void)
  * [`state(): State`](#state-state)
  * [`State` Type](#state-type)
    * [<code>called</code>](#called)
    * [<code>headers</code>](#headers)
    * [<code>postData</code>](#postdata)
- [Implementation](#implementation)

## HTTP API

The context can be used by setting it in a `zoroaster` test case:

```javascript
import { equal, ok, deepEqual } from 'zoroaster/assert'
import rqt from 'rqt'
import { HTTPContext } from 'https-context'

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
```

### `response(): string|buffer`

Returns what the response was set to (default `OK`).


### `host(): string`

The host of the server, e.g., `127.0.0.1:49629`.

### `url(): string`

Returns the server `url`, such as `http://127.0.0.1:49629`.

### `setResponse(`<br/>&nbsp;&nbsp;`data: string|Buffer,`<br/>`): void`

Sets the response with which the server will end the request. `OK` by default.

### `setHeaders(`<br/>&nbsp;&nbsp;`headers: Object,`<br/>`): void`

Sets the headers which are sent back to the client.

### `state(): State`

Get the state of the context, according to the [State type](#state-type).

### `State` Type

<table>
 <thead>
  <tr>
   <th>Property</th>
   <th>Type</th>
   <th>Description</th>
   <th>Example</th>
  </tr>
 </thead>
 <tbody>
   <tr>
  <td><a name="called"><code>called</code></a></td>
  <td><em>number</em></td>
  <td>The number of times the server was called. Starts with 0.</td>
  <td>0, 2, 3</td>
 </tr>
 <tr>
  <td><a name="headers"><code>headers</code></a></td>
  <td><em>object</em></td>
  <td>Request headers used previously.</td>
  <td>{}</td>
 </tr>
 <tr>
  <td><a name="postdata"><code>postData</code></a></td>
  <td><em>string</em></td>
  <td>The data sent with the request via any method other than `POST`.</td>
  <td>Hello World</td>
 </tr>
 </tbody>
</table>

## Implementation

```js
import { createServer } from 'http'
import { debuglog } from 'util'
const { Socket } = require('net') // eslint-disable-line no-unused-vars
import Catchment from 'catchment'

const LOG = debuglog('https-context')

export class HTTPContext {
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
```

---

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz
