import { useState } from 'react'
import styled from '@emotion/styled'
import { Surface, Row, Col, TextInput, Button, ModalContainer } from '../components/ui'
import { useAppSelector, useAppDispatch } from '../store'
import { authApi, type GetProfileResponse } from '../services/api'
import { pushToast } from '../store/slices/toastSlice'
import { updateProfileSucceeded } from '../store/slices/authSlice'
import DefaultAvatar from '../assets/default-avatar.svg'

const Wrap = styled.div({ maxWidth: 720, margin: '20px auto', padding: 20 })
const AvatarContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 20,
})
const Avatar = styled.img({
  width: 80,
  height: 80,
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #374151',
})
const DefaultAvatarImg = styled.img({
  width: 80,
  height: 80,
  borderRadius: '50%',
})

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username ?? '',
    email: user?.email ?? '',
  })
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)

  async function handleSave() {
    if (!user) return
    setIsLoading(true)
    try {
      let updatedUser: GetProfileResponse
      if (profilePicFile) {
        const formDataToSend = new FormData()
        formDataToSend.append('username', formData.username)
        formDataToSend.append('profilePic', profilePicFile)
        updatedUser = await authApi.updateProfileWithFile(formDataToSend)
      } else {
        updatedUser = await authApi.updateProfile(formData)
      }
      dispatch(updateProfileSucceeded(updatedUser.data.user))
      dispatch(pushToast({ title: 'Success', description: 'Profile updated!' }))
      setOpen(false)
      setProfilePicFile(null)
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
        <AvatarContainer>
          {user?.profilePic ? (
            <Avatar src={`/${user.profilePic}`} alt="Profile" />
          ) : (
            <DefaultAvatarImg src={DefaultAvatar} alt="Default Avatar" />
          )}
          <div>
            <h2 style={{ margin: 0 }}>{user?.username ?? 'Guest'}</h2>
            <div style={{ color: '#a1a1aa' }}>{user?.email ?? ''}</div>
          </div>
        </AvatarContainer>
        <Row style={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpen(true)}>Edit Profile</Button>
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
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#a1a1aa' }}>
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePicFile(e.target.files?.[0] || null)}
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #374151', 
                    borderRadius: 4, 
                    background: 'transparent',
                    color: 'white'
                  }}
                />
                {profilePicFile && (
                  <div style={{ marginTop: 8, fontSize: 14, color: '#10b981' }}>
                    Selected: {profilePicFile.name}
                  </div>
                )}
              </div>
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
