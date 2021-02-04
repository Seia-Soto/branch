import * as user from '../../../schema/user'
import { create, register } from '../../../structures/token'
import { exists, validate } from '../../../structures/user'
import { config } from '../../../defaults'

const { identifier, options } = config.application.cookie

export default {
  method: 'POST',
  url: '/assign',
  schema: {
    body: {
      type: 'object',
      properties: {
        email: user.email,
        password: user.password,
        next: {
          type: 'string',
          minLength: 'http://a.b'.length,
          maxLength: 256
        }
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

    if (userId < 0 || !await validate(body)) {
      response.status(400)

      return {
        status: 0
      }
    }

    try {
      const token = await create(userId)

      await register(userId, token)

      response.setCookie(identifier, token, options)

      if (body.next) {
        return response.redirect(302, body.next)
      }

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
