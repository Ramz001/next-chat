import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'
import { TooltipProvider } from '@shared/ui/tooltip'
import NuqsProvider from './nuqs.provider'
import { PostHogProvider } from './posthog.provider'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <TooltipProvider>
        <ThemeProvider>
          <NuqsProvider>
            <PostHogProvider>
              <ToastProvider>{children}</ToastProvider>
            </PostHogProvider>
          </NuqsProvider>
        </ThemeProvider>
      </TooltipProvider>
    </AuthSessionProvider>
  )
}
