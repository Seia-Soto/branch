import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.type = opts.type || 'tag'
  opts.format = opts.format || 'text'

  const trx = await knex.transaction()

  await trx('tags')
    .insert(opts)
    .then(trx.commit)
    .catch(trx.rollback)

  debug('created new tag:', opts.name, '/type', opts.type)

  return 1
}

export default create
