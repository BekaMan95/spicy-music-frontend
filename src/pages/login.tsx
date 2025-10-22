import { type FormEvent, useState, useEffect } from 'react'
import { TextInput, Button, Surface, Col } from '../components/ui'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../store'
import { loginRequested } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Wrap = styled.div({ maxWidth: 420, margin: '40px auto', padding: 20 })

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, user } = useAppSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/home')
    }
  }, [user, navigate])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (isLoading) return
    dispatch(loginRequested({ email, password }))
  }

  return (
    <Wrap>
      <Surface style={{ padding: 20 }}>
        <h2>Sign in</h2>
        <form onSubmit={onSubmit}>
          <Col>
            <TextInput placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </Col>
        </form>
      </Surface>
    </Wrap>
  )
}


