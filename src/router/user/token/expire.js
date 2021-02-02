import * as user from '../../../schema/user'
import { expire } from '../../../structures/token'
import { exists, validate } from '../../../structures/user'

export default {
  method: 'DELETE',
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
          }
        }
      }
    }
  },
  handler: async (request, response) => {
    const { body } = request

    const userId = await exists({ email: body.email })

    if (userId < 0 || !await validate(body)) {
      response.status(400)

      return {
        status: 0
      }
    }

    try {
      await expire(userId)

      return {
        status: 1
      }
    } catch (error) {
      response.status(500)

      return {
        status: 0
      }
    }
  }
}
