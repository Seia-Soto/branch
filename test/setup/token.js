let token

export default async (server, user) => {
  if (token) return token

  const response = await server.inject({
    method: 'POST',
    url: '/user/token',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Seia-Soto/branch <test>'
    },
    body: JSON.stringify(user)
  })
  const payload = JSON.parse(response.body)

  token = payload.result

  return token
}
