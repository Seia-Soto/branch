import * as argon2 from 'argon2'

const verify = async (hash, text) => {
  'use strict'

  if (!hash || !text) return false

  const result = await argon2.verify(hash, text)

  return result
}

export default verify
