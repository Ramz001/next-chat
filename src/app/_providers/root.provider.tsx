import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'
import BackgroundPattern from './background-pattern.provider'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <ThemeProvider>
        <ToastProvider>
          <BackgroundPattern />
          {children}
        </ToastProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}
