import { knex } from '../../database'
import debug from './debug'

const remove = async id => {
  'use strict'

  const trx = await knex.transaction()

  await trx('posts')
    .where({ id })
    .del()
    .then(trx.commit)
    .catch(trx.rollback)

  debug('removed post:', id)
}

export default remove
