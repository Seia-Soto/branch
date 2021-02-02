import { nanoid } from 'nanoid'

import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}

  const trx = await knex.transaction()

  await trx('users')
    .insert({
      username: opts.username,
      password: opts.password,
      email: opts.email,
      verification: nanoid(32),
      avatar: 'default'
    })
    .then(trx.commit)
    .catch(trx.rollback)

  debug('created new user:', opts.username)

  return 1
}

export default create
