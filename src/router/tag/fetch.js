import { exists, fetch } from '../../structures/tag'

export default {
  method: 'GET',
  url: '/:id',
  schema: {
    params: {
      id: {
        type: 'integer',
        minimum: 1
      }
    },
    query: {
      term: {
        type: 'string',
        enum: [
          'id',
          'author'
        ]
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 25
      },
      offset: {
        type: 'integer',
        minimum: 1
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
    const { term = 'id', limit, offset } = request.query
    const query = {
      [term]: request.params.id
    }
    const opts = {
      limit,
      offset
    }

    if (await exists(query) < 0) {
      response.status(400)

      return {
        status: 0
      }
    }

    return {
      status: 1,
      result: await fetch(query, opts)
    }
  }
}
