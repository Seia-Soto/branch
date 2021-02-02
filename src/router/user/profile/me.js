import authenticate from '../../../prehandlers/authenticate'
import { profile } from '../../../structures/user'

export default {
  method: 'GET',
  url: '/',
  schema: {
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
    const result = await profile(request.user, [
      'username',
      'email',
      'verification',
      'avatar',
      'permission'
    ])

    result.verification = !!result.verification

    return {
      status: 1,
      result
    }
  }
}
