import { knex } from '../../database'

const fetch = async id => {
  'use strict'

  const [item] = await knex('posts')
    .select('*')
    .where({
      id
    })

  return item
}

export default fetch
