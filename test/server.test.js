import {
  post,
  user
} from './mocks'
import serverSetup from './setup/server'
import tokenSetup from './setup/token'

let server

beforeAll(async () => {
  server = await serverSetup()
})
afterAll(() => {
  if (server) {
    server.close()
  }
})

describe('api:/user', () => {
  const endpoint = {
    method: 'POST',
    url: '/user',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>'
    }
  }

  it('should fail to create user without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('should create user', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(200)
  })

  it('should fail to create duplicated user', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(400)
  })
})

describe('api:/user/token', () => {
  const endpoint = {
    method: 'POST',
    url: '/user/token',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>'
    }
  }

  it('should fail to create token without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('should create token', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
  })

  endpoint.method = 'DELETE'

  it('should fail to delete token without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('should delete all token', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
  })
})

describe('api:/post', () => {
  const endpoint = {
    method: 'POST',
    url: '/post',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>',
      Authorization: ''
    }
  }

  beforeEach(async () => {
    endpoint.headers.Authorization = await tokenSetup(server, user)
  })

  it('should fail to create new post without authentication', async () => {
    expect.assertions(1)

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(403)
  })

  it('should fail to create new post without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('should create new post', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(200)
  })
})
