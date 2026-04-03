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
        <main className="flex h-[calc(100dvh-4rem)] flex-col">
          <ChatbotWidget />
        </main>
      </Gutter>
    )
  }

  return (
    <Gutter className="flex min-h-[90dvh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-foreground mb-2 text-4xl font-bold">
        Welcome to the Future Generations AI 👋
      </h1>
      <h2 className="text-muted-foreground mb-6 max-w-2xl text-xl">
        Official AI assistant for the Uzbek Ministry of Ecology & Sustainable
        Development
      </h2>
      <p className="text-muted-foreground mb-4 max-w-xl text-sm">
        Ask questions about environmental policies, sustainability laws, and
        principles to guide the sustainable development of your organisation.
      </p>
      <Button asChild>
        <Link href={'/auth/sign-in'}>Sign In to Access the Chatbot</Link>
      </Button>
    </Gutter>
  )
}
