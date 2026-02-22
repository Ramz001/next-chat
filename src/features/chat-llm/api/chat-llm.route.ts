import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { mapError } from '@shared/api/map-error'
import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'
import { ALLOWED_MODELS } from '@widgets/chatbot/model/ai-models'

const chatLLMSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(['user', 'assistant', 'system']),
        parts: z.array(z.record(z.string(), z.unknown())),
      })
    )
    .min(1, 'At least one message is required')
    .transform((msgs) => msgs as unknown as UIMessage[]),
  model: z.enum(ALLOWED_MODELS).default(ALLOWED_MODELS[0]),
})

export const chatLLM = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { messages, model } = chatLLMSchema.parse(body)

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: 2048,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    const { error: mappedError, status } = mapError(error)
    console.error('[Chat LLM Error]:', error)

    return NextResponse.json({ success: false, error: mappedError }, { status })
  }
}
