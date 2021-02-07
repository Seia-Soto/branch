import { knex } from '../../database'

const isAssigned = async term => {
  'use strict'

  term.action = 'assign'

  const [tag] = await knex('tag_actions')
    .select('id')
    .where(term)
    .limit(1)
  if (!tag) return 0

  return 1
}

export default isAssigned
