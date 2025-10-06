import {
  clearAllGoalieToken,
  getGoalieRefreshToken,
  getGoalieToken,
  isSessionExpired,
  saveGoalieRefreshToken,
  saveGoalieToken
} from '@auth-client'
import { messageError } from '@ui-components'
import axios from 'axios'

console.log('=================================')
console.log('process.env', process.env.NEXT_PUBLIC_BE_GATEWAY)
console.log('=================================')

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE_GATEWAY || ''
})

instance.interceptors.request.use(
  function(config) {
    const authorization = getGoalieToken()
    const refreshToken = getGoalieRefreshToken()

    // console.log('auth toke', authorization)
    // console.log('refresh', refreshToken)

    config.headers.setAuthorization(authorization)
    config.headers.set('refreshtoken', refreshToken)
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function(config) {
    const headers = config.headers
    const authorization = headers.authorization
    const refreshtoken = headers.refreshtoken

    // console.log('override token', authorization, refreshtoken)
    if (authorization && refreshtoken) {
      saveGoalieToken(authorization)
      saveGoalieRefreshToken(refreshtoken)
      // console.log('override done')
    }
    return config
  },
  async function(error) {
    const { response } = error

    // Clear all caches on authentication errors
    const clearAllCaches = async () => {
      try {
        const localforage = (await import('localforage')).default
        await localforage.clear()
        localStorage.clear()
        sessionStorage.clear()
        console.log('All caches cleared due to auth error')
      } catch (err) {
        console.error('Error clearing caches:', err)
      }
    }

    // Handle authentication errors (401, 403, 440)
    if (response && [401, 403, 440].includes(response.status)) {
      await clearAllCaches()

      if (response.status === 440 || isSessionExpired()) {
        messageError('Your session is expired. Please login again!')
        clearAllGoalieToken()
        window.location.href = '/sign-in'
        return
      }

      // For 401/403, redirect to sign-in
      messageError('Authentication failed. Please login again.')
      clearAllGoalieToken()
      window.location.href = '/sign-in'
      return
    }

    console.log('ERRIRIRIR', response)
    return Promise.reject(error)
  }
)

export const req = instance
export const httpGet = req.get
export const httpPost = req.post
export const httpPut = req.put
export const httpDel = req.delete
