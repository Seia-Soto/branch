import authenticateOptional from '../../prehandlers/authenticateOptional'
import { list, isPublic, isAccessible } from '../../structures/post'

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
    const result = []

    for (let i = 0, l = articles.length; i < l; i++) {
      const item = articles[i]

      const isVisible =
        (await isPublic(item)) ||
        (request.user && await isAccessible(request.user, item))
      if (isVisible) {
        result.push(item)
      }
    }

    return {
      status: 1,
      result
    }
  }
}
