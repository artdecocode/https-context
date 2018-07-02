# https-context

[![npm version](https://badge.fury.io/js/https-context.svg)](https://npmjs.org/package/https-context)

`https-context` is a new Node.js npm package. A Zoroaster test context that sets up an HTTP and self-signed HTTPS servers.

```sh
yarn add -E https-context
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`httpsContext(arg1: string, arg2?: boolean)`](#mynewpackagearg1-stringarg2-boolean-void)

## API

The package is available by importing its default function:

```js
import httpsContext from 'https-context'
```

### `httpsContext(`<br/>&nbsp;&nbsp;`arg1: string,`<br/>&nbsp;&nbsp;`arg2?: boolean,`<br/>`): void`

Call this function to get the result you want.

```js
/* yarn example */
import httpsContext from 'https-context'

(async () => {
  await httpsContext()
})()
```

---

(c) [Art Deco Code][1] 2018

[1]: https://artdeco.bz
