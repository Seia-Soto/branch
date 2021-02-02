import * as argon2 from 'argon2'

import { config } from '../../defaults'

const hash = async (text, tries) => {
  'use strict'

  tries = tries || 0

  if (!text || tries >= config.application.retry.max) {
    return false
  }

  try {
    const hash = await argon2.hash(text)

    return hash
  } catch (error) {
    return hash(text, tries + 1)
  }
}

export default hash
