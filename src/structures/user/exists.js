import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [user] = await knex('users')
    .select('id')
    .where(term)
    .limit(1)
  if (!user) return 0

  return 1
}

export default exists
