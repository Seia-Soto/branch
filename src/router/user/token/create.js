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

    if (!await exists({ email: body.email }) || !await validate(body)) {
      response.status(400)

      return {
        status: 0
      }
    }

    try {
      const token = await create(body.email)

      await register(body.email, token)

      return {
        status: 1,
        result: token
      }
    } catch (error) {
      return {
        status: 0
      }
    }
  }
}
