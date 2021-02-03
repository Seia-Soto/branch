import * as cluster from 'cluster'
import * as os from 'os'
// NOTE: thirdparties;
import fastify from 'fastify'

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

  server.register(router, { prefix: '/' })

  server.addHook('onClose', (server, done) => {
    debug('stopping server instance gracefully')

    database.knex.destroy()

    done()
  })
  server.addHook('onSend', (request, reply, payload, done) => {
    const invalid =
      (request.is404)
    if (invalid) {
      request.socket.destroy()
      done()
    }

    reply.header('Access-Control-Allow-Origin', '*')
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
