import { knex } from '../../database'

const profile = async (id, fields) => {
  'use strict'

  fields = fields || ['id']

  const [user] = await knex('users')
    .select(...fields)
    .where({
      id
    })
  if (!user) return { id: -1 }

  return user
}

export default profile
