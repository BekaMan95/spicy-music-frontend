import { useState } from 'react'
import styled from '@emotion/styled'
import { Surface, Row, Col, TextInput, Button, ModalContainer } from '../components/ui'
import { useAppSelector, useAppDispatch } from '../store'
import { authApi } from '../services/api'
import { pushToast } from '../store/slices/toastSlice'

const Wrap = styled.div({ maxWidth: 720, margin: '20px auto', padding: 20 })

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
  })

  async function handleSave() {
    if (!user) return
    setIsLoading(true)
    try {
      await authApi.updateProfile(formData)
      dispatch(pushToast({ title: 'Success', description: 'Profile updated!' }))
      setOpen(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile'
      dispatch(pushToast({ title: 'Error', description: message }))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrap>
      <Surface style={{ padding: 20 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0 }}>{user?.username ?? 'Guest'}</h2>
            <div style={{ color: '#a1a1aa' }}>{user?.email ?? ''}</div>
          </div>
          <Button onClick={() => setOpen(true)}>Edit</Button>
        </Row>
      </Surface>
      {open && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
            <Col>
              <TextInput 
                placeholder="Username" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
              <TextInput 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
              <Row>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Cancel</Button>
              </Row>
            </Col>
          </ModalContainer>
        </div>
      )}
    </Wrap>
  )
}


