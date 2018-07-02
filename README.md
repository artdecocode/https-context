# https-context

[![npm version](https://badge.fury.io/js/https-context.svg)](https://npmjs.org/package/https-context)

`https-context` is a Zoroaster test context that sets up an HTTP and self-signed HTTPS servers. It can be used in testing packages that make requests.

```sh
yarn add -E https-context
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Context](#context)
- [HTTP API](#http-api)
  * [`setResponse(data: string|Buffer)`](#setresponsedata-stringbuffer-void)
  * [`setHeaders(headers: Object)`](#setheadersheaders-object-void)
  * [`state(): State`](#state-state)
  * [`State` Type](#state-type)
    * [<code>called</code>](#called)
    * [<code>headers</code>](#headers)
    * [<code>postData</code>](#postdata)

## Context

%EXAMPLE src/index.js%

## HTTP API

The context can be used by setting it in a `zoroaster` test case:

%EXAMPLE test/spec/http-context.js, ../../src => https-context, javascript%

```response => "string|buffer"
```

Returns what the response was set to (default `OK`).

```url => "string"
```

Returns the server `url`.

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
  <td>`0`, `2`, `3`</td>
 </tr>
 <tr>
  <td><a name="headers"><code>headers</code></a></td>
  <td><em>object</em></td>
  <td>Request headers used previously.</td>
  <td>`{}`</td>
 </tr>
 <tr>
  <td><a name="postdata"><code>postData</code></a></td>
  <td><em>string</em></td>
  <td>The data sent with the request via any method other than `POST`.</td>
  <td>`Hello World`</td>
 </tr>
 </tbody>
</table>


---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
