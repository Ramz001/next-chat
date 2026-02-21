import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import { auth } from '@shared/api/auth'
import { SignOutButton } from '@shared/ui/sign-out-button'

export default async function HomePage() {
  const session = await auth()

  if (session) {
    return (
      <Gutter className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-foreground mb-2 text-4xl font-bold">
          Welcome back, {session.user?.name || 'User'}! 👋
        </h1>
        <h2 className="text-muted-foreground mb-6 text-xl">
          You are logged in with the email: {session.user?.email}
        </h2>
        <section className="flex items-center gap-4">
          <Button>
            <Link href={'/settings'}>Go to Settings</Link>
          </Button>
          <SignOutButton />
        </section>
      </Gutter>
    )
  }

  return (
    <Gutter className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-foreground mb-2 text-4xl font-bold">Hey there! 👋</h1>
      <h2 className="text-muted-foreground mb-6 text-xl">
        Welcome to our Auth Demo
      </h2>
      <Button>
        <Link href={'/auth/sign-in'}>Get Started with Authentication</Link>
      </Button>
    </Gutter>
  )
}
