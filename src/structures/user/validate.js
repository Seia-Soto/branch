import { knex } from '../../database'
import { verify } from '../password'
import debug from './debug'

const validate = async opts => {
  'use strict'

  const [user] = await knex('users')
    .select('password')
    .where({
      email: opts.email
    })
  const result = await verify(user.password, opts.password)

  debug('validated user:', opts.identifeir)

  return result
}

export default validate
