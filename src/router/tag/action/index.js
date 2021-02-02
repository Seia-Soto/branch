import assign from './assign'

export default (server, opts, done) => {
  server.route(assign)

  done()
}
