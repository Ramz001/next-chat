import { Button } from '@/shared/ui/button'
import Link from 'next/link'
import Gutter from '@shared/ui/gutter'
import { auth } from '@shared/api/auth'
import ChatbotWidget from '@/widgets/chatbot/widget'

export default async function HomePage() {
  const session = await auth()

  if (session) {
    return (
      <Gutter>
        <main className="flex h-[calc(100vh-4rem)] flex-col">
          <ChatbotWidget />
        </main>
      </Gutter>
    )
  }

  return (
    <Gutter className="flex min-h-[90vh] flex-col items-center justify-center gap-4">
      <h1 className="text-foreground mb-2 text-4xl font-bold">Hey there! 👋</h1>
      <h2 className="text-muted-foreground mb-6 text-xl">
        Sign in to start chatting with our AI assistant
      </h2>
      <Button asChild>
        <Link href={'/auth/sign-in'}>Sign In</Link>
      </Button>
    </Gutter>
  )
}
