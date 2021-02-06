import propertyRouter from './property'

import create from './create'
import fetch from './fetch'
import list from './list'
import remove from './remove'

export default (server, opts, done) => {
  server.register(propertyRouter, { prefix: '/property' })

  server.route(create)
  server.route(fetch)
  server.route(list)
  server.route(remove)

  done()
}
