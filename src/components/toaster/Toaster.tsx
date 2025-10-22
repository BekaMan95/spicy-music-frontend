import * as Toast from '@radix-ui/react-toast'
import styled from '@emotion/styled'

const Viewport = styled(Toast.Viewport)({
  position: 'fixed', bottom: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10, width: 360,
  zIndex: 50, outline: 'none',
})

const ToastRoot = styled(Toast.Root)(({ theme }) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md,
  padding: 12,
}))

const Title = styled(Toast.Title)({ fontWeight: 700 })
const Description = styled(Toast.Description)(({ theme }) => ({ color: theme.colors.subtext }))

export function AppToaster() {
  return <Viewport />
}

export function showToast({ title, description }: { title: string; description?: string }) {
  // Radix Toast is declarative; in quick scaffold we'll expose a simple component usage pattern.
  // For full control, implement a Redux slice later. For now, pages can render a Toast directly.
  return (
    <Toast.Provider swipeDirection="right">
      <ToastRoot open>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </ToastRoot>
      <Viewport />
    </Toast.Provider>
  )
}


