import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
} from '@shared/ui/ai-elements/attachments'
import { FileUIPart } from 'ai'
import { useCallback } from 'react'

export const AttachmentItem = ({
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
