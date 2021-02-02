import { knex } from '../../database'

const exists = async term => {
  'use strict'

  const [post] = await knex('posts')
    .select('id')
    .where(term)
  if (!post) return -1

  return post.id
}

export default exists
