import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from 'next-auth/react'
import posthog from 'posthog-js'

export const GithubLoginButton = () => {
  const handleLogin = async () => {
    try {
      await signIn('github', { redirect: true, redirectTo: '/' })
      posthog.capture('signed_in_github')
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Button onClick={handleLogin} variant="outline" type="button">
      Login with Github
    </Button>
  )
}
