import { knex } from '../../database'
import debug from './debug'

const create = async id => {
  'use strict'

  const trx = await knex.transaction()

  await trx('tag_actions')
    .where({
      item: id
    })
    .del()
    .catch(trx.rollback)
  await trx('tags')
    .where({
      id
    })
    .del()
    .catch(trx.rollback)
    .then(trx.commit)

  debug('removed tag:', id)

  return 1
}

export default create
