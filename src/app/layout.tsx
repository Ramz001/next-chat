import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import RootProvider from '@app/_providers/root.provider'
import Navbar from '@widgets/navbar'
import BackgroundPattern from '@shared/ui/background-pattern'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Next.js Chat App',
  description: 'A chat application built with Next.js and React.',
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
