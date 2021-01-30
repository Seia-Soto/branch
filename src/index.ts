import fastify from 'fastify'

import router from './router'
import { config } from './defaults'
import debug from './debug'

const server = fastify(config.libraries.fastify)

server.register(router, { prefix: '/' })

server.listen(config.application.port, () => {
  debug('application is listening on port:', config.application.port)
})
