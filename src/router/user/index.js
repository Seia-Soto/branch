import tokenRouter from './token'

import create from './create'

export default (server, opts, done) => {
  server.register(tokenRouter, { prefix: '/token' })

  server.route(create)

  done()
}
