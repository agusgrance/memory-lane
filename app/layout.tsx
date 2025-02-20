import '@/styles/index.css'
import { Toaster } from 'sonner'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        {children}
        <Toaster position='top-right' />
      </body>
    </html>
  )
}
