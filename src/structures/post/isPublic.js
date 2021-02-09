import knex from '../../database/knex'
import { isAssigned } from '../tag'

export default async postId => {
  const [tag] = await knex('tags')
    .select('id')
    .where({
      type: 'post_property',
      name: 'public'
    })

  return await isAssigned({ item: tag.id, target: postId })
}
