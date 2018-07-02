# https-context

%NPM: https-context%

`https-context` is a Zoroaster test context that sets up an HTTP and self-signed HTTPS servers. It can be used in testing packages that make requests. A new server will be installed for each test case, and all connections open to the server will be closed in the destroy method. This ensures that every gets gets a unique http server to be tested against, which is automatically destroyed so that the developers don't need to worry about implementing the tear-down.

```sh
yarn add -E https-context
```

## Table Of Contents

%TOC%
