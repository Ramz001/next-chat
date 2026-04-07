import { Suggestion } from '@shared/ui/ai-elements/suggestion'
import { useCallback } from 'react'

export const SuggestionItem = ({
  suggestion,
  onClick,
}: {
  suggestion: string
  onClick: (suggestion: string) => void
}) => {
  const handleClick = useCallback(() => {
    onClick(suggestion)
  }, [onClick, suggestion])

  return (
    <Suggestion
      onClick={handleClick}
      variant="outline"
      suggestion={suggestion}
    />
  )
}
