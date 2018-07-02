
## HTTP API

The context can be used by setting it in a `zoroaster` test case:

%EXAMPLE test/spec/http-context.js, ../../src => https-context, javascript%

```response => "string|buffer"
```

Returns what the response was set to (default `OK`).

```url => "string"
```

Returns the server `url`.

```### setResponse
[
  ["data", "string|Buffer"]
]
```

Sets the response with which the server will end the request. `OK` by default.

```### setHeaders
[
  ["headers", "Object"]
]
```

Sets the headers which are sent back to the client.

```### state => State
```

Get the state of the context, according to the [State type](#state-type).

### `State` Type

%TYPE true
<!-- <p name="postPromise" type="Promise">
  <d>asd</d>
  <e>asdf</e>
</p> -->
<p name="called" type="number">
  <d>The number of times the server was called. Starts with 0.</d>
  <e>`0`, `2`, `3`</e>
</p>
<p name="headers" type="object">
  <d>Request headers used previously.</d>
  <e>`{}`</e>
</p>
<p name="postData" type="string">
  <d>The data sent with the request via any method other than `POST`.</d>
  <e>`Hello World`</e>
</p>
%
