import { knex } from '../../../database'
import { config } from '../../../defaults'

const recent = async (opts, query) => {
  'use strict'

  const { limit, offset } = config.application.query

  const posts = await knex('posts')
    .select('id')
    .where(query)
    .orderBy('id', 'desc')
    .limit(opts.limit || limit)
    .offset(opts.offset || offset)

  for (let i = 0, l = posts.length; i < l; i++) {
    const id = posts[i].id

    posts[i] = id
  }

  return posts
}

export default recent
