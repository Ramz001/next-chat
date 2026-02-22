import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { NextRequest } from 'next/server'

export const chatLLM = async (req: NextRequest) => {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
