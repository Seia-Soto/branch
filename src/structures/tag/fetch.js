import { knex } from '../../database'
import { config } from '../../defaults'

const fetch = async (term, opts) => {
  'use strict'

  const { limit, offset } = config.application.query

  const [tag] = await knex('tags')
    .where(term)
    .orderBy('id', 'desc')
    .limit(opts.limit || limit)
    .offset(opts.offset || offset)

  return tag
}

export default fetch
