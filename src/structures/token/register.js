import * as crypto from 'crypto'

import { knex } from '../../database'

const expire = async (identifier, token) => {
  token = crypto.createHash('md5').update(token).digest('hex')

  const trx = await knex.transaction()

  await trx('tokens')
    .insert({
      issuer: identifier,
      token
    })
    .then(trx.commit)
    .catch(trx.rollback)
}

export default expire
