// app/layout.tsx
import './global.css'
import './darkmode.css'
import './style/index.css'
import localFont from 'next/font/local'
import RootLayoutComp from '../layouts/RootLayout'
import { GoalieProvider } from '@auth-client'

import dynamic from 'next/dynamic'
import GoogleAnalytics from './_components/GA'
import { CSPostHogProvider } from './providers'

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
})

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

const PushNotification = dynamic(
  () => import('./_components/PushNotification'),
  { ssr: false }
)

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'An open source task management for startups with low budget'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <CSPostHogProvider>
      <GoalieProvider>
        <html lang="en">
          <head>
            <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
          </head>
          <body className={inter.className}>
            <PostHogPageView />
            <RootLayoutComp>{children}</RootLayoutComp>
            <PushNotification />
            <GoogleAnalytics />
          </body>
        </html>
      </GoalieProvider>
    </CSPostHogProvider>
  )
}
