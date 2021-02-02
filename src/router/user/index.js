import profileRouter from './profile'
import tokenRouter from './token'

import create from './create'

export default (server, opts, done) => {
  server.register(tokenRouter, { prefix: '/token' })
  server.register(profileRouter, { prefix: '/profile' })

  server.route(create)

  done()
}
