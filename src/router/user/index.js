import tokenRouter from './token'

import create from './create'
import me from './me'
import profile from './profile'

export default (server, opts, done) => {
  server.register(tokenRouter, { prefix: '/token' })

  server.route(create)
  server.route(me)
  server.route(profile)

  done()
}
