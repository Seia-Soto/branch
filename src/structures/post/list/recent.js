import { knex } from '../../../database'
import { config } from '../../../defaults'
import { getById } from '../../../cache/specialTags'
import { isAssigned } from '../../tag'

const recent = async (opts, query) => {
  'use strict'

  const { limit, offset } = config.application.query

  const publicTagId = await getById('post_property', 'public')
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
