import { mdUserFindEmail, mdUserFindFirst } from '@database'
import { CKEY, hgetAll, hset, delCache } from '../lib/redis'

export const serviceGetUserById = async (id: string) => {
  try {
    const key = [CKEY.USER, id]
    const cached = await hgetAll(key)

    if (cached) return cached

    const result = await mdUserFindFirst({ id })
    if (!result) {
      console.log('User id not found: ', id)
      return null;
    }

    await hset(key, result)

    return result
  } catch (error) {
    console.log('service get user by id error', error)
    return null
  }
}

export const serviceGetUserByEmail = async (email: string) => {
  try {
    const key = [CKEY.USER, email]
    const cached = await hgetAll(key)

    if (cached) return cached

    const result = await mdUserFindEmail(email)

    if (!result) {
      console.log('Email not found: ', email)
      return null;
    }

    await hset(key, result)

    return result
  } catch (error) {
    console.log('service get user by id error', error)
    return null
  }
}

export const invalidateUserCache = async (userId: string, email?: string) => {
  try {
    await delCache([CKEY.USER, userId])
    if (email) {
      await delCache([CKEY.USER, email])
    }
    console.log('User cache invalidated for:', userId)
  } catch (error) {
    console.log('Error invalidating user cache:', error)
  }
}
