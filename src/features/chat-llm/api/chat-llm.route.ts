import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { withRouteErrorHandler } from '@shared/api/server-error-handlers'
import { NextResponse, NextRequest } from 'next/server'

const chatLLM = async (req: NextRequest): Promise<NextResponse> => {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    messages: await convertToModelMessages(messages),
  })

  const response = result.toUIMessageStreamResponse()
  return new NextResponse(response.body, response)
}

export const POST = withRouteErrorHandler(chatLLM)
