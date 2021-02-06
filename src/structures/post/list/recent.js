import { knex } from '../../../database'
import { config } from '../../../defaults'
import { getTagId } from '../../../cache/specialTags'
import { isAssigned } from '../../tag'

const recent = async (opts, query) => {
  'use strict'

  const { limit, offset } = config.application.query

  const publicTagId = await getTagId('post_property', 'public')
  const posts = await knex('posts')
    .select('id')
    .where(query)
    .orderBy('id', 'desc')
    .limit(opts.limit || limit)
    .offset(opts.offset || offset)

  const result = []

  for (let i = 0, l = posts.length; i < l; i++) {
    const id = posts[i].id

    posts[i] = id

    if (await isAssigned({ item: publicTagId, target: id }) >= 0) {
      result.push(id)
    }
  }

  return result
}

export default recent
