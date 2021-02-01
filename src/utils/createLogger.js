import debug from 'debug'

import pkg from '../../package.json'

export default (domain) => {
  if (domain) return debug(pkg.name + ':' + domain)

  return debug(pkg.name)
}
