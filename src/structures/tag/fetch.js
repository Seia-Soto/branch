import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [tag] = await knex('tags')
    .select('*')
    .where(term)

  return tag
}

export default exists
