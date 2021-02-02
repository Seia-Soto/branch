import { fetch } from '../../structures/post'

export default {
  method: 'GET',
  url: '/:id',
  schema: {
    params: {
      id: {
        type: 'integer'
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
    if (!request.params.id) {
      return {
        status: 0
      }
    }

    const item = await fetch(request.params.id)

    if (!item) {
      return {
        status: 0
      }
    }

    return {
      status: 1,
      result: item
    }
  }
}
