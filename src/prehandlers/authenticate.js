import { verify } from '../structures/token'
import { createLogger } from '../utils'

const debug = createLogger('prehandlers:authenticate')

export default async (request, response) => {
  const { authorization } = request.headers

  const unauthorize = () => {
    response.status(403)
    response.send({
      status: 0
    })
  }

  if (!authorization) {
    return unauthorize()
  }

  try {
    request.user = await verify(authorization)

    if (request.user < 0) return unauthorize()
  } catch (error) {
    debug('error while authenticating:', error)

    return unauthorize()
  }
}
