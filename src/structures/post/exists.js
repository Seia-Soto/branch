import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [post] = await knex('posts')
    .select('id')
    .where(term)
    .limit(1)
  if (!post) return 0

  return 1
}

export default exists
