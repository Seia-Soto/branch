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
      (await tag.exists({ id: body.item, type: 'post_property', format: 'text' })) &&
      (await post.exists({ id: body.target, author: request.user })) &&
      (await tag.isAssigned({ item: body.item, target: body.target }))
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
