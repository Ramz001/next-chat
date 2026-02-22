'use client'
import Link from 'next/link'
import { MessageSquareText } from 'lucide-react'
import { Role } from '@shared/prisma/generated/enums'
import { Button } from '@shared/ui/button'
import Gutter from '@shared/ui/gutter'
import { ThemeToggle } from './ui/theme-toggle'
import { UserMenu } from './ui/user-menu'
import { useSession } from 'next-auth/react'

type NavLink = {
  href: string
  label: string
}

export default function Navbar() {
  const { data: session } = useSession()
  const user = session?.user

  const navLinks: NavLink[] = [
    ...(user ? [{ href: '/settings', label: 'Settings' }] : []),
    ...(user?.role === Role.ADMIN ? [{ href: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <header className="border-border/40 bg-background/80 supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur-md">
      <Gutter className="flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-foreground flex shrink-0 items-center gap-2 font-semibold transition-opacity hover:opacity-80"
        >
          <MessageSquareText className="text-primary size-5" />
          <span className="inline">NextChat</span>
        </Link>

        {/* Desktop navigation */}

        {/* Right-side actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu — always rendered */}
          {/* <MobileMenu user={user} navLinks={navLinks} /> */}
        </div>
      </Gutter>
    </header>
  )
}
