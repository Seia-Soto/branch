import authenticateOptional from '../../prehandlers/authenticateOptional'
import { isAssigned } from '../../structures/tag'
import { list } from '../../structures/post'
import * as posts from '../../cache/posts'
import * as specialTags from '../../cache/specialTags'

export default {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      align: {
        type: 'string',
        enum: Object.keys(list)
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 25
      },
      offset: {
        type: 'integer',
        minimum: 0
      },
      user: {
        type: 'integer',
        minimum: 0
      }
    },
    response: {
      xxx: {
        type: 'object',
        properties: {
          status: {
            type: 'integer'
          },
          result: {
            type: 'object'
          }
        }
      }
    }
  },
  preHandler: [
    authenticateOptional
  ],
  handler: async (request, response) => {
    const { align, limit, offset, ...query } = request.query
    const opts = {
      limit,
      offset
    }
    const provider = list[align]

    if (!provider) {
      response.status(400)

      return {
        status: 0
      }
    }

    const articles = await provider(opts, query)
    const publicTagId = await specialTags.getById('post_property', 'public')

    const result = []

    for (let i = 0, l = articles.length; i < l; i++) {
      const item = articles[i]
      const isPublic = await isAssigned({ id: publicTagId }) >= 0

      if (isPublic) {
        result.push(item)

        continue
      }

      const isAccessible =
        (request.user === (await posts.getById(item)).author)
      if (isAccessible) {
        result.push(item)
      }
    }

    return {
      status: 1,
      result
    }
  }
}
