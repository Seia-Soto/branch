import authenticate from '../../prehandlers/authenticate'
import * as post from '../../schema/post'
import { create } from '../../structures/post'

export default {
  method: 'POST',
  url: '/',
  schema: {
    body: {
      type: 'object',
      properties: {
        title: post.title,
        content: post.content
      },
      required: [
        'title',
        'content'
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

    body.type = 'post'
    body.author = request.user

    await create(body)

    return {
      status: 1
    }
  }
}
