import action from './action'
import create from './create'

export default (server, opts, done) => {
  server.register(action, { prefix: '/action' })

  server.route(create)

  done()
}
