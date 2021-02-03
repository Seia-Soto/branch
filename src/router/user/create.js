import * as user from '../../schema/user'
import { hash } from '../../structures/password'
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
          },
          result: {
            type: 'integer'
          }
        }
      }
    }
  },
  handler: async (request, response) => {
    const { body } = request

    if (await exists({ email: body.email }) >= 0) {
      response.status(400)

      return {
        status: 0
      }
    }

    body.password = await hash(body.password)

    if (!body.password) {
      response.status(500)

      return {
        status: 0
      }
    }

    const result = {
      status: 1,
      result: await create(body)
    }

    if (result.result < 0) {
      response.status(500)
    }

    return result
  }
}
