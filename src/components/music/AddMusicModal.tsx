import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { createMusicRequested } from '../../store/slices/musicSlice'
import { ModalContainer, Button, TextInput, Col, Row } from '../ui'

interface AddMusicModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddMusicModal({ isOpen, onClose }: AddMusicModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((s) => s.music)
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    albumArt: '',
    genres: [] as string[],
  })

  function handleSubmit() {
    if (!formData.title || !formData.artist) return
    
    dispatch(createMusicRequested(formData))
    setFormData({ title: '', artist: '', album: '', albumArt: '', genres: [] })
    onClose()
  }

  function handleClose() {
    setFormData({ title: '', artist: '', album: '', albumArt: '', genres: [] })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      display: 'grid', 
      placeItems: 'center', 
      background: 'rgba(0,0,0,0.5)',
      zIndex: 50
    }} onClick={handleClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Add New Music</h3>
        <Col>
          <TextInput 
            placeholder="Title *" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
          <TextInput 
            placeholder="Artist *" 
            value={formData.artist} 
            onChange={(e) => setFormData({...formData, artist: e.target.value})} 
          />
          <TextInput 
            placeholder="Album" 
            value={formData.album} 
            onChange={(e) => setFormData({...formData, album: e.target.value})} 
          />
          <Row>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !formData.title || !formData.artist}
            >
              {isLoading ? 'Adding...' : 'Add Music'}
            </Button>
            <Button 
              onClick={handleClose} 
              style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}
            >
              Cancel
            </Button>
          </Row>
        </Col>
      </ModalContainer>
    </div>
  )
}
