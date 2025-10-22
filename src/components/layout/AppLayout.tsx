import styled from '@emotion/styled'
import { Link, Outlet } from 'react-router-dom'
import { colors } from '../../theme'
import { ProfileMenu } from '../profile/ProfileMenu'
import { ToasterHost } from '../toaster/ToasterHost'

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
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path fill={colors.accent} d="M12 2s2 3 2 5-2 3-2 5 2 3 2 5-2 5-2 5-8-3-8-10c0-5 5-7 8-10z"/>
    </svg>
  )
}

export function AppLayout() {
  return (
    <Shell>
      <Header>
        <Link to="/" style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700 }}>
          <FlameLogo /> <span>Spicy Music</span>
        </Link>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link to="/home">Home</Link>
          <ProfileMenu />
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


