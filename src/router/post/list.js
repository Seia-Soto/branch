import { list } from '../../structures/post'

export default {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      align: {
        type: 'string'
      },
      max: {
        type: 'integer',
        minimum: 1,
        maximum: 25
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
    const { query } = request

    const provider = list[query.align]

    if (!provider) {
      response.status(400)

      return {
        status: 0
      }
    }

    return {
      status: 1,
      result: await provider(query)
    }
  }
}
