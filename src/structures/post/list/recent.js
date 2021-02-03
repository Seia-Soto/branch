import { knex } from '../../../database'
import { config } from '../../../defaults'
import fetch from '../fetch'

const recent = async opts => {
  'use strict'

  opts = Object.assign(config.application.query, opts)

  const posts = await knex('posts')
    .select('id')
    .limit(opts.max)

  for (let i = 0, l = posts.length; i < l; i++) {
    posts[i] = await fetch(posts[i].id)
  }

  return posts
}

export default recent
