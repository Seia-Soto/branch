import * as cluster from 'cluster'
import * as os from 'os'
// NOTE: thirdparties;
import fastify from 'fastify'

import * as database from './database'
import router from './router'
import { config } from './defaults'
import { createLogger } from './utils'

export default (async () => {
  const server = fastify(config.libraries.fastify)

  const debug = createLogger()

  if (cluster.isMaster || (Number(process.env.pm_id) % os.cpus().length !== 0)) {
    debug('initiating on non-clustered environment')

    await database.utils.prepare()
  }

  server.register(router, { prefix: '/' })

  server.listen(config.application.port, () => {
    debug('application is listening on port:', config.application.port)
  })
})()
