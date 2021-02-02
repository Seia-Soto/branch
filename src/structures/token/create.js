import { sign } from 'jsonwebtoken'

import { config } from '../../defaults'

const create = identifier => {
  return sign({
    payload: identifier,
    algorithm: 'HS256',
    expiresIn: '2 hours',
    issuer: 'branch.system',
    ...config.token
  }, config.application.key)
}

export default create
