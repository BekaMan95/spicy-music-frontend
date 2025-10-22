import styled from '@emotion/styled'
import { Button } from '../components/ui'
import { Link } from 'react-router-dom'

const Hero = styled.section({
  maxWidth: 1000,
  margin: '0 auto',
  padding: '80px 20px',
  textAlign: 'center' as const,
})

export function LandingPage() {
  return (
    <Hero>
      <h1 style={{ fontSize: 56, margin: 0, letterSpacing: -1 }}>Feel the Heat</h1>
      <p style={{ color: '#a1a1aa', marginTop: 12 }}>A spicy, modern music experience.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <Link to="/signup"><Button>Get Started</Button></Link>
        <Link to="/login"><Button style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Sign In</Button></Link>
      </div>
    </Hero>
  )
}


