import {
  post,
  tag,
  user
} from './mocks'
import serverSetup from './setup/server'
import tokenSetup from './setup/token'

const suite = {}
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
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })
    const payload = JSON.parse(response.payload)

    suite.user = payload.result

    expect(response.statusCode).toBe(200)
    expect(payload.result).toBeDefined()
  })

  it('POST: (failure) should fail to create duplicated user', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(user)
    })

    expect(response.statusCode).toBe(400)
  })

  it('GET: (failure) should fail to get profile without authentication', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      method: 'GET'
    })

    expect(response.statusCode).toBe(403)
  })

  it('GET: should get profile', async () => {
    expect.assertions(1)

    endpoint.headers.Authorization = await tokenSetup(server, user)

    const response = await server.inject({
      ...endpoint,
      method: 'GET'
    })

    expect(response.statusCode).toBe(200)
  })

  it('GET: should get profile by username without authentication', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/' + suite.user
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.result.email).toBeUndefined()
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
    expect.assertions(3)

    const response = await server.inject({
      ...endpoint,
      body: user
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
    expect(payload.result).toBeTruthy()
  })

  it('/assign POST: should create token and assign it via cookie header', async () => {
    expect.assertions(3)

    const response = await server.inject({
      ...endpoint,
      url: endpoint.url + '/assign',
      body: user
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(response.headers['set-cookie']).toBeTruthy()
    expect(payload.status).toBe(1)
  })

  it('DELETE: (failure) should fail to delete token without params', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      method: 'DELETE'
    })

    expect(response.statusCode).toBe(400)
  })

  it('DELETE: should delete all token', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'DELETE',
      body: user
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
      'User-Agent': 'Seia-Soto/branch <test>'
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
      body: post
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST: (failure) should fail to create new post without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create new post', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      body: post
    })
    const payload = JSON.parse(response.body)

    suite.post = payload.result

    expect(response.statusCode).toBe(200)
    expect(payload.result).toBeDefined()
  })

  it('GET: (failure) should fail to get post with invalid id', async () => {
    expect.assertions(2)

    const invalidType = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/invalid'
    })
    const invalidId = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/-1'
    })

    expect(invalidType.statusCode).toBe(400)
    expect(invalidId.statusCode).toBe(400)
  })

  it('GET: should get post by id', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/' + suite.post
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
  })

  it('GET: (failure) should fail to list posts without `align` query', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(400)
    expect(payload.status).toBe(0)
  })

  it('GET: should list of recent posts', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent'
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
  })

  it('GET: (failure) should fail to list items by setting invalid `limit` query', async () => {
    expect.assertions(2)

    const invalidInteger = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&limit=-1'
    })
    const invalidType = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&limit=invalid'
    })

    expect(invalidInteger.statusCode).toBe(400)
    expect(invalidType.statusCode).toBe(400)
  })

  it('GET: should list only one item by setting `limit` query', async () => {
    expect.assertions(3)

    let size = 5

    while (--size) {
      await server.inject({
        ...endpoint,
        body: post
      })
    }

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&limit=1'
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
    expect(payload.result.length).toBeLessThanOrEqual(1)
  })

  it('GET: (failure) should fail to list items by setting invalid `offset` query', async () => {
    expect.assertions(2)

    const invalidInteger = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&offset=-1'
    })
    const invalidType = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&offset=invalid'
    })

    expect(invalidInteger.statusCode).toBe(400)
    expect(invalidType.statusCode).toBe(400)
  })

  it('GET: should list only one item by setting `offset` query', async () => {
    expect.assertions(3)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '?align=recent&offset=4'
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
    expect(payload.result.length).toBeLessThanOrEqual(1)
  })

  it('DELETE: (failure) should fail to remove new post without authentication', async () => {
    expect.assertions(1)

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      method: 'DELETE',
      url: endpoint.url + '/' + suite.post
    })

    expect(response.statusCode).toBe(403)
  })

  it('DELETE: (failure) should fail to remove post without params', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      method: 'DELETE',
      url: endpoint.url + '/' + suite.post
    })

    expect(response.statusCode).toBe(400)
  })

  it('DELETE: should remove post', async () => {
    expect.assertions(1)

    const response = await server.inject({
      ...endpoint,
      method: 'DELETE',
      url: endpoint.url + '/' + suite.post
    })

    expect(response.statusCode).toBe(200)
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
      body: tag
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST: (failure) should fail to create new tag without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should create new tag', async () => {
    expect.assertions(2)

    const response = await server.inject({
      ...endpoint,
      body: JSON.stringify(tag)
    })
    const payload = JSON.parse(response.body)

    suite.tag = payload.result

    expect(response.statusCode).toBe(200)
    expect(payload.result).toBeDefined()
  })

  it('GET: (failure) should fail to get tag by invalid id', async () => {
    expect.assertions(2)

    const invalidType = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/invalid'
    })
    const invalidIdPayload = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/-1'
    })

    expect(invalidType.statusCode).toBe(400)
    expect(invalidIdPayload.statusCode).toBe(400)
  })

  it('GET: should get tag by id', async () => {
    expect.assertions(3)

    const response = await server.inject({
      ...endpoint,
      method: 'GET',
      url: endpoint.url + '/' + suite.tag
    })
    const payload = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(payload.status).toBe(1)
    expect(payload.result.id).toBe(1)
  })
})

describe('api:/tag/action', () => {
  const endpoint = {
    method: 'POST',
    url: '/tag/action',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>',
      Authorization: ''
    }
  }

  beforeEach(async () => {
    endpoint.headers.Authorization = await tokenSetup(server, user)
  })

  it('POST: (failure) should fail to assign tag to post without authentication', async () => {
    expect.assertions(1)

    // NOTE: create new post;
    const postCreation = await server.inject({
      ...endpoint,
      method: 'POST',
      url: '/post',
      body: post
    })
    const payload = JSON.parse(postCreation.body)

    suite.post = payload.result

    delete endpoint.headers.Authorization

    const response = await server.inject({
      ...endpoint,
      body: {
        item: 1,
        target: suite.post
      }
    })

    expect(response.statusCode).toBe(403)
  })

  it('POST: (failure) should fail to assign tag to post without params', async () => {
    expect.assertions(1)

    const response = await server.inject(endpoint)

    expect(response.statusCode).toBe(400)
  })

  it('POST: should assign tag to post', async () => {
    expect.assertions(4)

    const response = await server.inject({
      ...endpoint,
      body: {
        item: 1,
        target: suite.post
      }
    })

    expect(response.statusCode).toBe(200)

    const fetchPost = await server.inject({
      method: 'GET',
      url: '/post/' + suite.post,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Seia-Soto/branch <test>',
        Authorization: endpoint.headers.Authorization
      }
    })
    const post = JSON.parse(fetchPost.body)

    expect(fetchPost.statusCode).toBe(200)
    expect(post.status).toBe(1)
    expect(post.result.tags[1]).toBe(1)
  })
})
