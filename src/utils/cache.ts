type CacheEntry<T> = {
  value: T;
  expireAt: number;
};

const cache: Record<string, CacheEntry<any>> = {};

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
