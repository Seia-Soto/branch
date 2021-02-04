import assign from './assign'
import create from './create'
import expire from './expire'

export default (server, opts, done) => {
  server.route(assign)
  server.route(create)
  server.route(expire)

  done()
}
