import { verify } from '../structures/token'
import { createLogger } from '../utils'
import { config } from '../defaults'

const debug = createLogger('prehandlers:authenticate')

const { identifier } = config.application.cookie

export default async (request, response) => {
  const authorization =
    request.headers.authorization ||
    request.cookies[identifier]

  try {
    request.user = await verify(authorization)
  } catch (error) {
    debug('(optional) error while authenticating:', error.name)
  }
}
