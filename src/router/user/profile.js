import { profile } from '../../structures/user'

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
    const result = await profile(
      request.params.id,
      [
        'username',
        'verification',
        'avatar'
      ]
    )

    result.verification = !!result.verification

    return {
      status: 1,
      result
    }
  }
}
