import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.type = opts.type || 'post'

  const trx = await knex.transaction()

  return trx('posts')
    .insert(opts)
    .then(async id => {
      await trx.commit()

      debug('created new post:', opts.title)

      return id[0] || -1
    })
    .catch(trx.rollback)
}

export default create
