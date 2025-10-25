import styled from '@emotion/styled'
import { Link, Outlet } from 'react-router-dom'
import { ProfileMenu } from '../profile/ProfileMenu'
import { ToasterHost } from '../toaster/ToasterHost'
import { useAppSelector } from '../../store'

const Shell = styled.div({ display: 'flex', minHeight: '100vh', flexDirection: 'column' })
const Header = styled.header(({ theme }) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 20px', borderBottom: `1px solid ${theme.colors.border}`,
  position: 'sticky', top: 0, background: theme.colors.background, zIndex: 10,
}))
const Footer = styled.footer(({ theme }) => ({
  borderTop: `1px solid ${theme.colors.border}`, padding: '16px 20px', color: theme.colors.subtext,
}))
const Main = styled.main({ flex: 1 })

function FlameLogo() {
  return (
    <img src='/spicy.svg' alt='Spicy' height={28} width={28}></img>
  )
}

export function AppLayout() {
  const user = useAppSelector((s) => s.auth.user) // get current session

  return (
    <Shell>
      <Header>
        <Link to="/" style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700 }}>
          <FlameLogo /> <span>Spicy Music</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/home">Home</Link>
          {user && <ProfileMenu />} {/* only if session exists */}
        </nav>
      </Header>
      <Main>
        <Outlet />
      </Main>
      <Footer>
        <span>© {new Date().getFullYear()} Spicy Music</span>
      </Footer>
      <ToasterHost />
    </Shell>
  )
}
