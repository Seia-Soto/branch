import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.type = opts.type || 'post'

  const trx = await knex.transaction()

  await trx('posts')
    .insert(opts)
    .then(trx.commit)

  debug('created new post:', opts.title)

  return 1
}

export default create
