import { Button } from '@/shared/ui/button'
import { handleError } from '@shared/utils/handle-error'
import { signIn } from 'next-auth/react'

export const GithubLoginButton = () => {
  const handleLogin = async () => {
    try {
      await signIn('github', { redirect: true, redirectTo: '/settings' })
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
