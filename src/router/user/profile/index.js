import me from './me'
import profile from './profile'

export default (server, opts, done) => {
  server.route(me)
  server.route(profile)

  done()
}
