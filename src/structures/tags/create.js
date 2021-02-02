import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.type = opts.type || 'tag'

  const trx = await knex.transaction()

  await trx('tags')
    .insert(opts)
    .then(trx.commit)

  debug('created new tag:', opts.title, '/type', opts.type)

  return 1
}

export default create
