import create from './create'
import expire from './expire'

export default (server, opts, done) => {
  server.route(create)
  server.route(expire)

  done()
}
