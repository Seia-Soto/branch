import create from './create'
import fetch from './fetch'

export default (server, opts, done) => {
  server.route(create)
  server.route(fetch)

  done()
}
