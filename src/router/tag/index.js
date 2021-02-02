import actionRouter from './action'

import create from './create'
import fetch from './fetch'

export default (server, opts, done) => {
  server.register(actionRouter, { prefix: '/action' })

  server.route(create)
  server.route(fetch)

  done()
}
