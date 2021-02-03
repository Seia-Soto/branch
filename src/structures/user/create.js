import { nanoid } from 'nanoid'

import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}

  const trx = await knex.transaction()

  return trx('users')
    .insert({
      username: opts.username,
      password: opts.password,
      email: opts.email,
      verification: nanoid(32),
      avatar: 'default'
    })
    .then(async id => {
      await trx.commit()

      debug('created new user:', opts.username)

      return id[0] || -1
    })
    .catch(trx.rollback)
}

export default create
