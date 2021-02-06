import LRU from 'lru-cache'

import { fetch } from '../structures/post'
import { config } from '../defaults'

export const cache = new LRU(config.libraries.lru)

export const getById = async id => {
  if (cache.has(id)) {
    return cache.get(id)
  }

  const post = await fetch(id)

  cache.set(id, post)

  return post
}
