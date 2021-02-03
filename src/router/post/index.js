import create from './create'
import fetch from './fetch'
import list from './list'

export default (server, opts, done) => {
  server.route(create)
  server.route(fetch)
  server.route(list)

  done()
}
