import os from 'os'

const config = {
  application: {
    port: 9000,
    key: 'test',
    retry: {
      max: 2
    }
  },
  policy: {
    user: {
      emailVerificationEnabled: false
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
      },
      useNullAsDefault: true
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
