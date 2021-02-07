import authenticateOptional from '../../prehandlers/authenticateOptional'
import { getById } from '../../cache/posts'
import { exists, isAccessible, isPublic } from '../../structures/post'

export default {
  method: 'GET',
  url: '/:id',
  schema: {
    params: {
      id: {
        type: 'integer',
        minimum: 1
      }
    },
    response: {
      xxx: {
        type: 'object',
        properties: {
          status: {
            type: 'integer'
          },
          result: {
            type: 'object'
          }
        }
      }
    }
  },
  preHandler: [
    authenticateOptional
  ],
  handler: async (request, response) => {
    const { id } = request.params

    const isAvailable =
      (await exists({ id })) &&
      (
        (await isPublic(id)) ||
        (request.user && await isAccessible(request.user, request))
      )
    if (!isAvailable) {
      return {
        status: 0
      }
    }

    const item = await getById(id)

    if (!item) {
      return {
        status: 0
      }
    }

    return {
      status: 1,
      result: item
    }
  }
}
