import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.type = opts.type || 'tag'
  opts.format = opts.format || 'text'

  const trx = await knex.transaction()

  return trx('tags')
    .insert(opts)
    .then(async id => {
      await trx.commit()

      debug('created new tag:', opts.name, '/type', opts.type)

      return id[0] || -1
    })
    .catch(trx.rollback)
}

export default create
