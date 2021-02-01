import * as user from '../../schema/user'
import { create, exists } from '../../structures/user'

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
    const { body } = request

    if (await exists({ email: body.email })) {
      response.status(400)

      return {
        status: 0
      }
    }

    const result = {
      status: await create(body)
    }

    if (!result.status) {
      response.status(500)
    }

    return result
  }
}
