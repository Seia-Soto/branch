import authenticate from '../../../prehandlers/authenticate'
import * as post from '../../../structures/post'
import * as tag from '../../../structures/tag'

export default {
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      properties: {
        item: {
          type: 'integer'
        },
        target: {
          type: 'integer'
        }
      },
      required: [
        'item',
        'target'
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

    const valid =
      (body.item) ||
      (body.target) ||
      (await tag.exists({ id: body.item }) >= 0) ||
      (await post.exists({ id: body.target }) >= 0)
    if (!valid) {
      response.status(400)

      return {
        status: 0
      }
    }

    body.author = request.user

    await tag.assign(body)

    return {
      status: 1
    }
  }
}
