import { type FormEvent, useState, useEffect } from 'react'
import { TextInput, Button, Surface, Col } from '../components/ui'
import styled from '@emotion/styled'
import { useAppDispatch, useAppSelector } from '../store'
import { signupRequested } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Wrap = styled.div({ maxWidth: 480, margin: '40px auto', padding: 20 })

export function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, user } = useAppSelector((s) => s.auth)
  const [username, setName] = useState('')
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
    dispatch(signupRequested({ username, email, password }))
  }

  return (
    <Wrap>
      <Surface style={{ padding: 20 }}>
        <h2>Create account</h2>
        <form onSubmit={onSubmit}>
          <Col>
            <TextInput placeholder="Username" value={username} onChange={(e) => setName(e.target.value)} />
            <TextInput placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextInput placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign up'}
            </Button>
          </Col>
        </form>
      </Surface>
    </Wrap>
  )
}


