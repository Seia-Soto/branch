import { knex } from '../../../database'
import { config } from '../../../defaults'
import fetch from '../fetch'

const recent = async opts => {
  'use strict'

  const { limit, offset } = config.application.query

  const posts = await knex('posts')
    .select('id')
    .orderBy('id', 'desc')
    .limit(opts.limit || limit)
    .offset(opts.offset || offset)

  for (let i = 0, l = posts.length; i < l; i++) {
    posts[i] = await fetch(posts[i].id)
  }

  return posts
}

export default recent
