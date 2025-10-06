'use client'
import { clearAllGoalieToken, clearGoalieUser, useUser } from '@auth-client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import localforage from 'localforage'
import { usePostHog } from 'posthog-js/react'

export default function Signout() {
  const { user } = useUser()
  const { push } = useRouter()
  const posthog = usePostHog()

  useEffect(() => {
    const clearAllData = async () => {
      try {
        // Clear IndexedDB (localforage)
        await localforage.clear()

        // Clear all localStorage
        localStorage.clear()

        // Clear all sessionStorage
        sessionStorage.clear()

        // Reset PostHog
        posthog.reset()

        console.log('All caches cleared')
      } catch (error) {
        console.error('Error clearing caches:', error)
      } finally {
        push('/sign-in')
      }
    }

    setTimeout(() => {
      clearAllData()
    }, 500)
  }, [])
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="w-[400px] text-center space-y-6">
        <h2 className="text-3xl font-bold text-gray-700">
          See you soon, {user?.name} !
        </h2>
        <p className="text-gray-500 text-base">
          I have to say goodbye to you with regret. 😭
          <br /> Logging out ...👋
        </p>
      </div>
    </div>
  )
}
