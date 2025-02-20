import { Inter } from 'next/font/google'

import { Toaster } from 'sonner'
import { Providers } from './providers'

import { BackToTop } from '@/components/BackToTop'

import '@/styles/index.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster position='top-right' />
        <BackToTop />
      </body>
    </html>
  )
}
