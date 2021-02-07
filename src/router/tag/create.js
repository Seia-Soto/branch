import authenticate from '../../prehandlers/authenticate'
import * as tag from '../../schema/tag'
import { create, exists } from '../../structures/tag'

export default {
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      properties: tag,
      required: [
        'name',
        'description'
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
  preHandler: [
    authenticate
  ],
  handler: async (request, response) => {
    const { body } = request

    body.type = 'tag'
    body.format = 'text'

    if (await exists({ name: body.name })) {
      response.status(400)

      return {
        status: 0
      }
    }

    body.author = request.user

    return {
      status: 1,
      result: await create(body)
    }
  }
}
