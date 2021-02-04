import * as cluster from 'cluster'
import * as os from 'os'
// NOTE: thirdparties;
import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyHelmet from 'fastify-helmet'
import fastifyCookie from 'fastify-cookie'

import * as database from './database'
import router from './router'
import { config } from './defaults'
import { createLogger } from './utils'

export default async init => {
  const server = fastify(config.libraries.fastify)

  const debug = createLogger()

  if (init || (cluster.isMaster || (Number(process.env.pm_id) % os.cpus().length !== 0))) {
    debug('initiating on non-clustered environment')

    await database.utils.prepare()
  }

  server.register(fastifyCors)
  server.register(fastifyHelmet, config.libraries.helmet)
  server.register(fastifyCookie, { secret: config.application.key })
  server.register(router, { prefix: '/' })

  server.addHook('onClose', (server, done) => {
    debug('stopping server instance gracefully')

    database.knex.destroy()

    done()
  })
  server.addHook('onSend', async (request, reply, payload) => {
    const invalid =
      (request.is404)
    if (invalid) {
      request.socket.destroy()

      return null
    }

    return payload
  })

  server.setErrorHandler(async (error, request) => {
    debug(request.method, request.url, error)

    if (error.validation) {
      return error
    }

    return {
      status: 0
    }
  })

  return server
}
