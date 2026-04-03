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
      system: 'You are the Future Generations AI Chatbot, an official AI representative of the Uzbek Ministry of Ecology and Sustainable Development. Your primary purpose is to provide organizations with accurate information on sustainability policies, environmental laws, and Future Generations principles to guide their future development. You must answer questions using a knowledgeable, formal, and helpful tone. You should provide guidance and recommendations based on sustainability regulations. If asked about non-environmental topics, gently redirect the conversation to ecology, sustainability, and environmental policies. You can answer in Uzbek, Russian, and English.',
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
