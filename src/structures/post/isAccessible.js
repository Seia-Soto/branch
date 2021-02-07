import { getById } from '../../cache/posts'

export default async (user, postId) => {
  const isAccessible =
    (user === (await getById(postId)).author)

  return isAccessible
}
