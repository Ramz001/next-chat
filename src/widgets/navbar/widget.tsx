import Link from 'next/link'
import { MessageSquareText } from 'lucide-react'
import { auth } from '@shared/api/auth'
import { Role } from '@shared/prisma/generated/enums'
import { Button } from '@shared/ui/button'
import Gutter from '@shared/ui/gutter'
import { ThemeToggle } from './ui/theme-toggle'
import { UserMenu } from './ui/user-menu'
import { MobileMenu } from './ui/mobile-menu'

type NavLink = {
  href: string
  label: string
}

export default async function Navbar() {
  const session = await auth()
  const user = session?.user ?? null

  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
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
          <span className="hidden sm:inline">NextChat</span>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

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
          <MobileMenu user={user} navLinks={navLinks} />
        </div>
      </Gutter>
    </header>
  )
}
