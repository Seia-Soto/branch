import { getById } from '../../cache/posts'
import { exists } from '../../structures/post'

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
    if (await exists({ id: request.params.id }) < 0) {
      return {
        status: 0
      }
    }

    const item = await getById(request.params.id)

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
