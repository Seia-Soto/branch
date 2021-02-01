import { nanoid } from 'nanoid'

import { knex } from '../../database'
import { config } from '../../defaults'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts._tries = opts._tries || 0

  if (opts._tries >= config.application.retry.max) {
    return 0
  }

  const trx = await knex.transaction()

  try {
    await trx('users')
      .insert({
        username: opts.username,
        password: opts.password,
        email: opts.email,
        verification: nanoid(32),
        avatar: 'default',
        permission: 0
      })
      .then(trx.commit)

    debug('created new user:', opts.username)

    return 1
  } catch (error) {
    await trx.rollback()

    debug('failed to create user:', error)

    opts._tries++

    return create(opts)
  }
}

export default create
