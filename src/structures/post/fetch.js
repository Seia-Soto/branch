import { knex } from '../../database'

const fetch = async id => {
  'use strict'

  const [item] = await knex('posts')
    .select('*')
    .where({
      id
    })
  const tags = await knex('tag_actions')
    .select('author', 'item', 'createdAt')
    .where({
      action: 'assign',
      target: id
    })

  item.tags = {}

  for (let i = 0, l = tags.length; i < l; i++) {
    const tagId = tags[i].item

    item.tags[tagId] = item.tags[tagId] || 0
    item.tags[tagId] += 1
  }

  return item
}

export default fetch
