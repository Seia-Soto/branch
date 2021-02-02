import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

import { knex } from '../../database'
import { config } from '../../defaults'

const verify = async token => {
  const hash = crypto.createHash('md5').update(token).digest('hex')

  const [item] = await knex('tokens')
    .select('id')
    .where({
      token: hash
    })
  if (!item) {
    return -1
  }

  const { payload } = jwt.decode(token, config.application.key)

  return payload
}

export default verify
