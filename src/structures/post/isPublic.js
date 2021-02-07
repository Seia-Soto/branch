import * as posts from '../../cache/posts'
import * as specialTags from '../../cache/specialTags'

export default async postId => {
  const publicTagId = await specialTags.getById('post_property', 'public')
  const isAssigned = await isAssigned({ item: publicTagId, target: postId }) >= 0

  return isAssigned
}
