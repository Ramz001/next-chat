'use client'

import type { FileUIPart } from 'ai'
import type { PromptInputMessage } from '@shared/ui/ai-elements/prompt-input'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

import axios from 'axios'
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from '@shared/ui/ai-elements/attachments'
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@shared/ui/ai-elements/conversation'
import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageContent,
  MessageResponse,
} from '@shared/ui/ai-elements/message'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@shared/ui/ai-elements/model-selector'
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@shared/ui/ai-elements/prompt-input'
import { Shimmer } from '@shared/ui/ai-elements/shimmer'
import { SpeechInput } from '@shared/ui/ai-elements/speech-input'
import { Suggestion, Suggestions } from '@shared/ui/ai-elements/suggestion'
import { CheckIcon, GlobeIcon, StopCircleIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { chefs, suggestions, models } from './model/ai-models'

const AttachmentItem = ({
  attachment,
  onRemove,
}: {
  attachment: FileUIPart & { id: string }
  onRemove: (id: string) => void
}) => {
  const handleRemove = useCallback(() => {
    onRemove(attachment.id)
  }, [onRemove, attachment.id])

  return (
    <Attachment data={attachment} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentInfo />
      <AttachmentRemove variant={'destructive'} />
    </Attachment>
  )
}

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments()

  const handleRemove = useCallback(
    (id: string) => {
      attachments.remove(id)
    },
    [attachments]
  )

  if (attachments.files.length === 0) {
    return null
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  )
}

const SuggestionItem = ({
  suggestion,
  onClick,
}: {
  suggestion: string
  onClick: (suggestion: string) => void
}) => {
  const handleClick = useCallback(() => {
    onClick(suggestion)
  }, [onClick, suggestion])

  return <Suggestion onClick={handleClick} suggestion={suggestion} />
}

const ModelItem = ({
  m,
  isSelected,
  onSelect,
}: {
  m: (typeof models)[0]
  isSelected: boolean
  onSelect: (id: string) => void
}) => {
  const handleSelect = useCallback(() => {
    onSelect(m.id)
  }, [onSelect, m.id])

  return (
    <ModelSelectorItem onSelect={handleSelect} value={m.id}>
      <ModelSelectorLogo provider={m.chefSlug} />
      <ModelSelectorName>{m.name}</ModelSelectorName>
      <ModelSelectorLogoGroup>
        {m.providers.map((provider) => (
          <ModelSelectorLogo key={provider} provider={provider} />
        ))}
      </ModelSelectorLogoGroup>
      {isSelected ? (
        <CheckIcon className="ml-auto size-4" />
      ) : (
        <div className="ml-auto size-4" />
      )}
    </ModelSelectorItem>
  )
}

const ChatbotWidget = () => {
  const [model, setModel] = useState<string>(models[0].id)
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [text, setText] = useState<string>('')
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        body: { model },
      }),
    [model]
  )

  const { messages, status, stop, sendMessage } = useChat({ transport })

  const selectedModelData = useMemo(
    () => models.find((m) => m.id === model),
    [model]
  )

  const getMessageText = useCallback(
    (msg: (typeof messages)[number]) =>
      msg.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join(''),
    []
  )

  const handlePromptSubmit = useCallback(
    (message: PromptInputMessage) => {
      const hasText = Boolean(message.text)
      const hasAttachments = Boolean(message.files?.length)

      if (!(hasText || hasAttachments)) {
        return
      }

      if (message.files?.length) {
        toast.success('Files attached', {
          description: `${message.files.length} file(s) attached to message`,
        })
      }

      sendMessage({
        text: message.text || 'Sent with attachments',
        files: message.files,
      })
      setText('')
    },
    [sendMessage]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      sendMessage({ text: suggestion })
    },
    [sendMessage]
  )

  const handleTranscriptionChange = useCallback((transcript: string) => {
    setText((prev: string) => (prev ? `${prev} ${transcript}` : transcript))
  }, [])

  const handleAudioRecorded = useCallback(async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    try {
      const { data } = await axios.post('/api/transcribe', formData)
      return data.text ?? ''
    } catch {
      toast.error('Transcription failed', {
        description: 'Could not transcribe audio. Please try again.',
      })
      return ''
    }
  }, [])

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value)
    },
    []
  )

  const toggleWebSearch = useCallback(() => {
    setUseWebSearch((prev) => !prev)
  }, [])

  const handleModelSelect = useCallback((modelId: string) => {
    setModel(modelId)
    setModelSelectorOpen(false)
  }, [])

  const isLoading = useMemo(
    () => status === 'streaming' || status === 'submitted',
    [status]
  )

  const isSubmitDisabled = useMemo(
    () => !text.trim() || isLoading,
    [text, isLoading]
  )

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 && <ConversationEmptyState />}
          {messages.map((message, index) => {
            const messageText = getMessageText(message)
            const isLastMessage = index === messages.length - 1
            const isAssistant = message.role === 'assistant'
            const showShimmer =
              isAssistant && isLastMessage && isLoading && !messageText

            return (
              <MessageBranch defaultBranch={0} key={message.id}>
                <MessageBranchContent>
                  <Message
                    from={isAssistant ? 'assistant' : 'user'}
                    key={message.id}
                  >
                    <div>
                      <MessageContent>
                        {showShimmer ? (
                          <Shimmer duration={1.5}>Thinking...</Shimmer>
                        ) : (
                          <MessageResponse
                            controls={{ code: true, table: true }}
                          >
                            {messageText}
                          </MessageResponse>
                        )}
                      </MessageContent>
                    </div>
                  </Message>
                </MessageBranchContent>
              </MessageBranch>
            )
          })}
          {isLoading && (
            <div className="flex justify-center py-2">
              <button
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors"
                onClick={stop}
                type="button"
              >
                <StopCircleIcon size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <Suggestions>
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion}
              onClick={handleSuggestionClick}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
        <div className="w-full pb-2">
          <PromptInput globalDrop multiple onSubmit={handlePromptSubmit}>
            <PromptInputHeader>
              <PromptInputAttachmentsDisplay />
            </PromptInputHeader>
            <PromptInputBody>
              <PromptInputTextarea onChange={handleTextChange} value={text} />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent className="w-full">
                    <PromptInputActionAddAttachments />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
                <SpeechInput
                  className="shrink-0"
                  onAudioRecorded={handleAudioRecorded}
                  onTranscriptionChange={handleTranscriptionChange}
                  size="icon-sm"
                  variant="ghost"
                />
                <PromptInputButton
                  onClick={toggleWebSearch}
                  variant={useWebSearch ? 'default' : 'ghost'}
                >
                  <GlobeIcon size={16} />
                  <span>Search</span>
                </PromptInputButton>
                <ModelSelector
                  onOpenChange={setModelSelectorOpen}
                  open={modelSelectorOpen}
                >
                  <ModelSelectorTrigger asChild>
                    <PromptInputButton>
                      {selectedModelData?.chefSlug && (
                        <ModelSelectorLogo
                          provider={selectedModelData.chefSlug}
                        />
                      )}
                      {selectedModelData?.name && (
                        <ModelSelectorName>
                          {selectedModelData.name}
                        </ModelSelectorName>
                      )}
                    </PromptInputButton>
                  </ModelSelectorTrigger>
                  <ModelSelectorContent>
                    <ModelSelectorInput placeholder="Search models..." />
                    <ModelSelectorList>
                      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                      {chefs.map((chef) => (
                        <ModelSelectorGroup heading={chef} key={chef}>
                          {models
                            .filter((m) => m.chef === chef)
                            .map((m) => (
                              <ModelItem
                                isSelected={model === m.id}
                                key={m.id}
                                m={m}
                                onSelect={handleModelSelect}
                              />
                            ))}
                        </ModelSelectorGroup>
                      ))}
                    </ModelSelectorList>
                  </ModelSelectorContent>
                </ModelSelector>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={isSubmitDisabled}
                onStop={stop}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}

export default ChatbotWidget
