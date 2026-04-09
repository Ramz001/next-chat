import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import RootProvider from '@app/_providers/root.provider'
import Navbar from '@widgets/navbar'
import BackgroundPattern from '@shared/ui/background-pattern'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Future Generations AI Chatbot',
  description:
    'Official AI assistant for the Uzbek Ministry of Ecology & Sustainable Development.',
  icons: {
    icon: '/chat.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} antialiased`}>
        <BackgroundPattern />
        <RootProvider>
          <Navbar />
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
