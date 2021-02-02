import authenticate from '../../prehandlers/authenticate'
import * as tag from '../../schema/tag'
import { create } from '../../structures/post'

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
    body.author = request.user

    await create(body)

    return {
      status: 1
    }
  }
}
