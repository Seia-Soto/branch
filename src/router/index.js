import postRouter from './post'
import userRouter from './user'

export default (server, opts, done) => {
  server.register(postRouter, { prefix: '/post' })
  server.register(userRouter, { prefix: '/user' })

  done()
}
