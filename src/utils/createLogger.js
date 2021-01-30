import debug from 'debug'

import { name } from '../../package.json'

export default (domain) => {
  if (domain) return debug(name + ':' + domain)

  return debug(name)
}
