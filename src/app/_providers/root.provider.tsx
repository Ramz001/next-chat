import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'
import { TooltipProvider } from '@shared/ui/tooltip'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <TooltipProvider>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </TooltipProvider>
    </AuthSessionProvider>
  )
}
