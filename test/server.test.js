import {
  post,
  tag,
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

  it('POST: (failure) should fail to create user without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create user', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(200)
  })

  it('POST: (failure) should fail to create duplicated user', async () => {
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

  it('POST: (failure) should fail to create token without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create token', async () => {
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

  it('DELETE: (failure) should fail to delete token without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('DELETE: should delete all token', async () => {
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

describe('api:/user/profile', () => {
  const endpoint = {
    method: 'GET',
    url: '/user/profile',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>',
      Authorization: ''
    }
  }

  beforeEach(async () => {
    endpoint.headers.Authorization = await tokenSetup(server, user)
  })

  it('GET: (failure) should fail to get profile without authentication', async () => {
    expect.assertions(1)

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(403)
  })

  it('GET: should get profile', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(200)
  })

  it('GET: should get profile by username', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      url: endpoint.url + '/' + user.username,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(200)
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

  it('POST: (failure) should fail to create new post without authentication', async () => {
    expect.assertions(1)

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST: (failure) should fail to create new post without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create new post', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(post)
    })

    expect(response.statusCode).toBe(200)
  })

  it('GET: (failure) should fail to get post with invalid id', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/invalid'
    })

    expect(response.statusCode).toBe(400)
  })

  it('GET: should get post by id', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/1'
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
  })
})

describe('api:/tag', () => {
  const endpoint = {
    method: 'POST',
    url: '/tag',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>',
      Authorization: ''
    }
  }

  beforeEach(async () => {
    endpoint.headers.Authorization = await tokenSetup(server, user)
  })

  it('POST: (failure) should fail to create new tag without authentication', async () => {
    expect.assertions(1)

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(tag)
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST: (failure) should fail to create new tag without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create new tag', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(tag)
    })

    expect(response.statusCode).toBe(200)
  })
})
