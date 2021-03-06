import os from 'os'
import { nanoid } from 'nanoid'

const config = {
  application: {
    port: 9000,
    key: nanoid(),
    query: {
      limit: 25,
      offset: 0
    },
    cookie: {
      identifier: '__Host-identifier',
      options: {
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: 'strict',
        path: '/'
      }
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
        password: '',
        pool: {
          min: 1,
          max: (os.cpus().length * 2) || 4
        },
        charset: 'utf8'
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
    },
    cors: {
      origin: (origin, callback) => {
        if (/(http:\/\/localhost|https:\/\/[\w\d.\-_]*seia\.io)/.test(origin)) {
          return callback(null, true)
        }

        const error = new Error('Cross Origin Access was not allowed from: ' + origin)

        error.unsafe = true

        callback(error)
      },
      methods: [
        'GET', 'POST', 'DELETE'
      ],
      credentials: true,
      maxAge: 60 * 15,
      preflightContinue: true,
      hideOptionsRoute: true
    },
    helmet: {
      expectCt: {
        enfore: true
      },
      referrerPolicy: {
        policy: 'no-referrer'
      },
      hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
        preload: true
      },
      dnsPrefetchControl: {
        allow: true
      },
      frameguard: {
        action: 'deny'
      },
      permittedCrossDomainPolicies: {
        permittedPolicies: 'by-content-type'
      }
    },
    lru: {
      max: 250,
      maxAge: 1000 * 20
    }
  }
}

export {
  config
}
