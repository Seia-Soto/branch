import { knex } from '../../database'
import debug from './debug'

const create = async opts => {
  'use strict'

  opts = opts || {}
  opts.action = 'assign'

  const trx = await knex.transaction()

  await trx('tag_actions')
    .insert(opts)
    .then(trx.commit)
    .catch(trx.rollback)

  debug('assigned new tag to post:', opts.item, '/tag', opts.target)

  return 1
}

export default create
