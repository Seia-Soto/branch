import knex from '../database/knex'

export const cache = {}

export const getTagId = async (type, name) => {
  const key = type + '_' + name

  if (cache[key]) {
    return cache[key]
  }

  const [tag] = await knex('tags')
    .select('id')
    .where({
      type,
      name
    })
  cache[key] = tag

  return tag
}
