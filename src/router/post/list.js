import { list } from '../../structures/post'

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

    return {
      status: 1,
      result: await provider(opts, query)
    }
  }
}
