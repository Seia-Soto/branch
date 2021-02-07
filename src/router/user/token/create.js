import * as user from '../../../schema/user'
import { create, register } from '../../../structures/token'
import { exists, validate } from '../../../structures/user'

export default {
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      properties: {
        email: user.email,
        password: user.password
      },
      required: [
        'email',
        'password'
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
            type: 'string'
          }
        }
      }
    }
  },
  handler: async (request, response) => {
    const { body } = request

    const userId = await exists({ email: body.email })

    if (!userId || !await validate(body)) {
      response.status(400)

      return {
        status: 0
      }
    }

    try {
      const token = await create(userId)

      await register(userId, token)

      return {
        status: 1,
        result: token
      }
    } catch (error) {
      response.status(500)

      return {
        status: 0
      }
    }
  }
}
