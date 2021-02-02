import create from './create'

export default (server, opts, done) => {
  server.route(create)

  done()
}
