import { createLogger } from './utils'

const pkg = createLogger('')
const info = createLogger('info')
const error = createLogger('error')
const debug = createLogger('debug')

export {
  pkg as default,
  info,
  error,
  debug
}
