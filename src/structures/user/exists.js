import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [user] = await knex('users')
    .select('id')
    .where(term)

  return !!user
}

export default exists
