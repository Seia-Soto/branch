import knex from '../database/knex'

export const cache = {}

export const getById = async (type, name) => {
  const key = type + ':' + name

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
