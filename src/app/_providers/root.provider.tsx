import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'
import { TooltipProvider } from '@shared/ui/tooltip'
import NuqsProvider from './nuqs.provider'
import { PostHogProvider } from './posthog.provider'
import { ConsentProvider } from './consent.provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConsentProvider>
      <Analytics />
      <SpeedInsights />
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
    </ConsentProvider>
  )
}
