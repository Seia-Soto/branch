import os from 'os'

const config = {
  application: {
    port: 9000,
    key: 'github-workflow-test-key',
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
        },
        charset: 'utf8_general_ci'
      },
      useNullAsDefault: true
    }
  },
  token: {
    algorithm: 'HS256',
    expiresIn: '2 hours',
    issuer: 'branch.system'
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
