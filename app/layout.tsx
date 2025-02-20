import '@/styles/index.css'
import { Toaster } from 'sonner'
import './globals.css'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
        <Toaster position='top-right' />
      </body>
    </html>
  )
}
