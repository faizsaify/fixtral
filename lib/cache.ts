interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheItem<any>;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Cache = {};
  private readonly defaultDuration = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  set<T>(key: string, data: T, duration?: number): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  get<T>(key: string, maxAge?: number): T | null {
    const item = this.cache[key];
    if (!item) return null;

    const now = Date.now();
    const age = now - item.timestamp;
    const maxAgeToUse = maxAge || this.defaultDuration;

    if (age > maxAgeToUse) {
      delete this.cache[key];
      return null;
    }

    return item.data as T;
  }

  invalidate(key: string): void {
    delete this.cache[key];
  }
}

export const cacheManager = CacheManager.getInstance();
