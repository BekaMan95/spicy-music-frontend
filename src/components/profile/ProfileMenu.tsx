import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../store'
import { useState } from 'react'
import { logoutRequested } from '../../store/slices/authSlice'
import DefaultAvatar from '/default-avatar.svg'
import { Button } from '../ui'


const Trigger = styled.button(({ theme }) => ({
  background: 'transparent', color: theme.colors.text, border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.round, padding: '6px 10px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8
}))
const Menu = styled.div(({ theme }) => ({
  position: 'absolute', right: 0, top: '120%', background: theme.colors.surface, border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md, minWidth: 160, padding: 8, display: 'flex', flexDirection: 'column', gap: 6,
}))
const Wrapper = styled.div({ position: 'relative' })
const Avatar = styled.img({
  width: 24,
  height: 24,
  borderRadius: '50%',
  objectFit: 'cover',
})
const DefaultAvatarImg = styled.img({
  width: 28,
  height: 28,
  borderRadius: '50%',
})

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
      <Trigger onClick={() => setOpen((v) => !v)}>
        {user?.profilePic ? (
          <Avatar src={`${import.meta.env.VITE_API_URL}/${user.profilePic}`} alt="Profile" />
        ) : (
          <DefaultAvatarImg src={DefaultAvatar} alt="Default Avatar" />
        )}
        {user ? user.username : 'Guest'}
      </Trigger>
      {open && (
        <Menu>
          <Link to="/profile" onClick={() => setOpen(false)}> <Button style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32', width: '100%' }} > Profile </Button> </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </Menu>
      )}
    </Wrapper>
  )
}
