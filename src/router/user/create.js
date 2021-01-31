import * as user from '../../schema/user'
import { create } from '../../structures/user'

export default {
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      properties: user,
      required: [
        'username',
        'password',
        'email'
      ]
    },
    response: {
      xxx: {
        type: 'object',
        properties: {
          status: {
            type: 'integer'
          }
        }
      }
    }
  },
  handler: async (request, response) => {
    const result = {
      status: await create(request.body)
    }

    if (!result.status) {
      response.status(500)
    }

    return result
  }
}
