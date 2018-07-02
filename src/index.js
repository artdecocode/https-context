import { debuglog } from 'util'

const LOG = debuglog('https-context')

/**
 * A Zoroaster test context that sets up an HTTP and self-signed HTTPS servers.
 * @param {Config} config Configuration object.
 * @param {string} config.type The type.
 */
export default async function httpsContext(config = {}) {
  const {
    type,
  } = config
  LOG('https-context called with %s', type)
  return type
}

/**
 * @typedef {Object} Config
 * @property {string} type The type.
 */
