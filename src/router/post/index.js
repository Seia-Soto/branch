import create from './create'
import fetch from './fetch'
import list from './list'
import remove from './remove'

export default (server, opts, done) => {
  server.route(create)
  server.route(fetch)
  server.route(list)
  server.route(remove)

  done()
}
