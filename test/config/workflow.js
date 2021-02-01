import os from 'os'

const config = {
  application: {
    port: 9000,
    retry: {
      max: 2
    }
  },
  database: {
    client: {
      client: 'mysql2',
      connection: {
        host: 'localhost',
        user: 'root',
        database: 'branch',
        password: 'root',
        pool: {
          min: 1,
          max: (os.cpus().length * 2) || 4
        }
      }
    }
  },
  libraries: {
    fastify: {
      logger: false
    }
  }
}

export {
  config
}
