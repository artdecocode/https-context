"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = httpsContext;

var _util = require("util");

const LOG = (0, _util.debuglog)('https-context');
/**
 * A Zoroaster test context that sets up an HTTP and self-signed HTTPS servers.
 * @param {Config} config Configuration object.
 * @param {string} config.type The type.
 */

async function httpsContext(config = {}) {
  const {
    type
  } = config;
  LOG('https-context called with %s', type);
  return type;
}
/**
 * @typedef {Object} Config
 * @property {string} type The type.
 */
//# sourceMappingURL=index.js.map