import { nanoid } from 'nanoid'

import { knex } from '../../database'
import { config } from '../../defaults'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts._tries = opts._tries || 0

  if (opts._tries >= config.application.retry.max) {
    return false
  }

  const trx = knex.transaction()

  try {
    await trx('users')
      .insert({
        username: opts.username,
        password: opts.password,
        email: opts.email,
        verification: nanoid(256),
        avatar: 'default',
        permission: 0
      })
      .then(trx.commit)

    debug('created new user:', opts.username)

    return opts.username
  } catch (error) {
    debug('failed to create user:', error)

    opts._tries++

    return create(opts)
  }
}

export default create
