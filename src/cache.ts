const TTLCache = require('@isaacs/ttlcache')

export const cache = new TTLCache({ 
  max: 10000, 
  ttl: 400 
})
