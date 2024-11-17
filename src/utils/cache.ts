type CacheEntry<T> = {
  value: T;
  expireAt: number;
};

const cache: Record<string, CacheEntry<any>> = {};

/**
 * This function sets a value in the cache with a specified key and Time To Live (TTL).
 * The TTL is optional and defaults to 3600 seconds (1 hour) if not provided.
 * The function calculates the expiration time of the cache entry and logs it.
 * Finally, it adds the cache entry to the cache.
 *
 * @param {string} key - The key under which the value is stored in the cache.
 * @param {T} value - The value to be stored in the cache.
 * @param {number} ttl - The Time To Live for the cache entry in seconds. Defaults to 3600 seconds (1 hour).
 */
export const setCache = <T>(key: string, value: T, ttl = 3600): void => {
  const expireAt = Date.now() + ttl * 1000;
  cache[key] = { value, expireAt };
};

export const getCache = <T>(key: string): T | null => {
  const entry = cache[key];
  if (!entry || Date.now() > entry.expireAt) {
    delete cache[key];
    return null;
  }
  return entry.value;
};

export const clearCache = (): void => {
  for (let key in cache) {
    delete cache[key];
  }
};
