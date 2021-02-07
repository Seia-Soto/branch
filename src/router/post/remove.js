import authenticate from '../../prehandlers/authenticate'
import { exists, remove } from '../../structures/post'

export default {
  method: 'DELETE',
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
  preHandler: [
    authenticate
  ],
  handler: async (request, response) => {
    if (await exists({ id: request.params.id, author: request.user })) {
      return {
        status: 0
      }
    }

    const item = await remove(request.params.id)

    if (!item) {
      response.status(400)

      return {
        status: 0
      }
    }

    return {
      status: 1
    }
  }
}
