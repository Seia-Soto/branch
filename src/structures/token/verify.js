import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

import { knex } from '../../database'
import { config } from '../../defaults'

const verify = async (identifier, token) => {
  const hash = crypto.createHash('md5').update(token).digest('hex')

  const [item] = await knex('tokens')
    .select('id')
    .where({
      identifier,
      token: hash
    })
  if (!item) {
    return 0
  }

  const payload = jwt.verify(token, config.application.key)

  return payload
}

export default verify
