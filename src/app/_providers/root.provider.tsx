import ToastProvider from './toast.provider'
import AuthSessionProvider from './session.provider'
import ThemeProvider from './theme.provider'

export default function RootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </AuthSessionProvider>
  )
}
