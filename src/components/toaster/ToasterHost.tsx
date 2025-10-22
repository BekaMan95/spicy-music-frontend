import * as Toast from '@radix-ui/react-toast'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../../store'
import { removeToast } from '../../store/slices/toastSlice'

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

export function ToasterHost() {
  const items = useAppSelector((s) => s.toast.items)
  const dispatch = useAppDispatch()
  return (
    <Toast.Provider swipeDirection="right">
      {items.map((t) => (
        <ToastRoot key={t.id} open onOpenChange={(open) => { if (!open) dispatch(removeToast(t.id)) }}>
          <Title>{t.title}</Title>
          {t.description ? <Description>{t.description}</Description> : null}
        </ToastRoot>
      ))}
      <Viewport />
    </Toast.Provider>
  )
}


