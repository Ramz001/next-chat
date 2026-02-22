'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Menu, X, LogOut } from 'lucide-react'
import { Role } from '@shared/prisma/generated/enums'
import { Button } from '@shared/ui/button'
import { Separator } from '@shared/ui/separator'
import { cn } from '@shared/utils/cn'
import type { Session } from 'next-auth'

type NavLink = {
  href: string
  label: string
}

type MobileMenuProps = {
  user?: Session['user'] 
  navLinks: NavLink[]
}

export function MobileMenu({ user, navLinks }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div ref={menuRef} className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-down panel */}
      <div
        className={cn(
          'fixed left-0 right-0 top-14 z-50 border-b border-border/50 bg-background/95 shadow-lg backdrop-blur-md transition-all duration-200',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
          {/* Nav links */}
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start font-normal',
                pathname === link.href && 'bg-muted font-medium'
              )}
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}

          {/* Authenticated user section */}
          {user && (
            <>
              <Separator className="my-1" />
              <div className="px-3 py-2">
                <p className="text-sm font-medium leading-none">{user.name ?? 'User'}</p>
                <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={async () => {
                  setOpen(false)
                  await signOut()
                }}
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </>
          )}

          {/* Unauthenticated user section */}
          {!user && (
            <>
              <Separator className="my-1" />
              <Button size="sm" className="w-full" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
