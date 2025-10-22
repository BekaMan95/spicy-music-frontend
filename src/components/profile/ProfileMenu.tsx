import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store'
import { useState } from 'react'
import { logoutRequested } from '../../store/slices/authSlice'

const Trigger = styled.button(({ theme }) => ({
  background: 'transparent', color: theme.colors.text, border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.round, padding: '6px 10px', cursor: 'pointer'
}))
const Menu = styled.div(({ theme }) => ({
  position: 'absolute', right: 0, top: '120%', background: theme.colors.surface, border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md, minWidth: 160, padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
}))
const Wrapper = styled.div({ position: 'relative' })

export function ProfileMenu() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [open, setOpen] = useState(false)

  function handleLogout() {
    dispatch(logoutRequested())
    setOpen(false)
  }

  return (
    <Wrapper>
      <Trigger onClick={() => setOpen((v) => !v)}>{user ? user.username : 'Guest'}</Trigger>
      {open && (
        <Menu>
          <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </Menu>
      )}
    </Wrapper>
  )
}


