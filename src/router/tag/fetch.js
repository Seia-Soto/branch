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
    const { id } = request.params

    if (await exists({ id }) < 0) {
      response.status(400)

      return {
        status: 0
      }
    }

    return {
      status: 1,
      result: await fetch({ id })
    }
  }
}
