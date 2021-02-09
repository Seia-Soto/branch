import knex from '../../database/knex'

export default async (user, postId) => {
  const [post] = await knex('posts')
    .select('author')
    .where({
      id: postId
    })
  const isAccessible =
    (user === post.author)

  return isAccessible
}
