import userRouter from './user'

export default (server, opts, done) => {
  server.register(userRouter, { prefix: '/user' })

  done()
}
