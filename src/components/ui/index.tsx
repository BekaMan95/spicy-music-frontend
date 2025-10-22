import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

export const Button = styled.button(({ theme }) => ({
  background: theme.colors.accent,
  color: '#0b0b0c',
  border: 0,
  borderRadius: theme.radii.md,
  padding: '10px 14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 120ms ease, filter 120ms ease',
  ':hover': { filter: 'brightness(1.05)' },
  ':active': { transform: 'translateY(1px)' },
}))

export const TextInput = styled.input(({ theme }) => ({
  width: '100%',
  background: theme.colors.surface,
  color: theme.colors.text,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md,
  padding: '10px 12px',
  outline: 'none',
  '::placeholder': { color: theme.colors.subtext },
  ':focus': { borderColor: theme.colors.accent },
}))

export const Surface = styled.div(({ theme }) => ({
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.lg,
}))

const fadeIn = keyframes({ from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'translateY(0)' } })

export const ModalContainer = styled(Surface)({
  padding: 16,
  minWidth: 320,
  maxWidth: 560,
  animation: `${fadeIn} 160ms ease both`,
})

export const Row = styled.div({ display: 'flex', alignItems: 'center', gap: 12 })
export const Col = styled.div({ display: 'flex', flexDirection: 'column', gap: 12 })
export const Spacer = styled.div<{ h?: number }>((props) => ({ height: props.h ?? 16 }))


