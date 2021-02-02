import authenticate from '../../../prehandlers/authenticate'
import * as user from '../../../schema/user'
import { profile } from '../../../structures/user'

export default {
  method: 'GET',
  url: '/:username',
  schema: {
    params: {
      username: user.username
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
    if (!request.params.username) {
      return {
        status: 0
      }
    }

    const result = await profile(
      request.user,
      [
        'username',
        'verification',
        'avatar',
        'permission'
      ]
    )

    result.verification = !!result.verification

    return {
      status: 1,
      result
    }
  }
}
