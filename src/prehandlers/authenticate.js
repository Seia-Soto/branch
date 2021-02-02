import { verify } from '../structures/token'

export default async (request, response) => {
  const { Authorization } = request.headers

  const unauthorize = () => {
    response.status(403)

    return {
      status: 0
    }
  }

  if (!Authorization) {
    return unauthorize()
  }

  try {
    request.user = await verify(Authorization)

    if (!request.user) throw new Error()
  } catch (error) {
    return unauthorize()
  }
}
