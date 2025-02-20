import '@/styles/index.css'
import { Toaster } from 'sonner'
import './globals.css'
import { Providers } from './providers'
import { Inter } from 'next/font/google'
import { BackToTop } from '@/components/BackToTop'

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
