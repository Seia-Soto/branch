import fastify from 'fastify'

import { config } from './defaults'
import debug from './debug'

const server = fastify(config.libraries.fastify)

server.listen(config.application.port, () => {
  debug('application is listening on port:', config.application.port)
})
