/**
 * Cache utility functions with best practices
 *
 * Best practices implemented:
 * 1. Clear all caches on logout
 * 2. Validate session before using cached data
 * 3. Set TTL for cached data
 * 4. Clear cache on auth errors
 */

import localforage from 'localforage'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt?: number
}

/**
 * Clear all application caches (IndexedDB, localStorage, sessionStorage)
 */
export const clearAllCaches = async (): Promise<void> => {
  try {
    await localforage.clear()
    localStorage.clear()
    sessionStorage.clear()
    console.log('All caches cleared')
  } catch (error) {
    console.error('Error clearing caches:', error)
    throw error
  }
}

/**
 * Set item in cache with optional TTL (time to live in milliseconds)
 */
export const setCacheItem = async <T>(
  key: string,
  data: T,
  ttl?: number
): Promise<void> => {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    expiresAt: ttl ? Date.now() + ttl : undefined
  }

  try {
    await localforage.setItem(key, entry)
  } catch (error) {
    console.error(`Error setting cache item ${key}:`, error)
  }
}

/**
 * Get item from cache, returns null if expired or not found
 */
export const getCacheItem = async <T>(key: string): Promise<T | null> => {
  try {
    const entry = await localforage.getItem<CacheEntry<T>>(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      await localforage.removeItem(key)
      return null
    }

    return entry.data
  } catch (error) {
    console.error(`Error getting cache item ${key}:`, error)
    return null
  }
}

/**
 * Remove item from cache
 */
export const removeCacheItem = async (key: string): Promise<void> => {
  try {
    await localforage.removeItem(key)
  } catch (error) {
    console.error(`Error removing cache item ${key}:`, error)
  }
}

/**
 * Clear all caches matching a pattern (e.g., 'PROJECT_*')
 */
export const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await localforage.keys()
    const regex = new RegExp(pattern.replace('*', '.*'))

    const keysToRemove = keys.filter(key => regex.test(key))
    await Promise.all(keysToRemove.map(key => localforage.removeItem(key)))

    console.log(`Cleared ${keysToRemove.length} cache entries matching pattern: ${pattern}`)
  } catch (error) {
    console.error(`Error clearing cache by pattern ${pattern}:`, error)
  }
}

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{
  itemCount: number
  keys: string[]
}> => {
  try {
    const keys = await localforage.keys()
    return {
      itemCount: keys.length,
      keys
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return { itemCount: 0, keys: [] }
  }
}
