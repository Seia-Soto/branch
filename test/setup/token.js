export default async (server, user) => {
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

  return payload.result
}
