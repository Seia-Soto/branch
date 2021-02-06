import assign from './assign'
import deassign from './deassign'

export default (server, opts, done) => {
  server.route(assign)
  server.route(deassign)

  done()
}
