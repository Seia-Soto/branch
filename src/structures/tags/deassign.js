import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.action = 'assign'

  const trx = await knex.transaction()

  await trx('tag_actions')
    .where(opts)
    .del()
    .then(trx.commit)
    .catch(trx.rollback)

  debug('deassigned tag:', opts.item, '/type', opts.type, '/target', opts.target)

  return 1
}

export default create
