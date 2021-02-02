import postRouter from './post'
import tagRouter from './tag'
import userRouter from './user'

export default (server, opts, done) => {
  server.register(postRouter, { prefix: '/post' })
  server.register(tagRouter, { prefix: '/tag' })
  server.register(userRouter, { prefix: '/user' })

  done()
}
