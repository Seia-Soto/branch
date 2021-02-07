import * as specialTags from '../../cache/specialTags'
import { isAssigned } from '../tag'

export default async postId => {
  const publicTagId = await specialTags.getById('post_property', 'public')

  return await isAssigned({ item: publicTagId, target: postId })
}
