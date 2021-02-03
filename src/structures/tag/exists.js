import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [tag] = await knex('tags')
    .select('id')
    .where(term)
    .limit(1)
  if (!tag) return -1

  return tag.id
}

export default exists
