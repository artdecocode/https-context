# https-context

[![npm version](https://badge.fury.io/js/https-context.svg)](https://npmjs.org/package/https-context)

`https-context` is a Zoroaster test context that sets up an HTTP and self-signed HTTPS servers. It can be used in testing packages that make requests. A new server will be installed for each test case, and all connections open to the server will be closed in the destroy method. This ensures that every gets gets a unique http server to be tested against, which is automatically destroyed so that the developers don't need to worry about implementing the tear-down.

```sh
yarn add -DE https-context
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

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
