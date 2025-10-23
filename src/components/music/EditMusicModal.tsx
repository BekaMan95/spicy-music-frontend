import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { updateMusicRequested } from '../../store/slices/musicSlice'
import { ModalContainer, Button, TextInput, Col, Row } from '../ui'
import { type CreateMusicData, type Music } from '../../services/api'

interface EditMusicModalProps {
  isOpen: boolean
  onClose: () => void
  music: Music
}

export function EditMusicModal({ isOpen, onClose, music }: EditMusicModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((s) => s.music)
  const [formData, setFormData] = useState({
    title: music.title,
    artist: music.artist,
    album: music.album,
    albumArt: music.albumArt,
    genres: music.genres,
  })
  const [albumArtFile, setAlbumArtFile] = useState<File | null>(null)

  function handleSubmit() {
    
    const musicData: Partial<CreateMusicData> = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        genres: formData.genres,
    }

    if (albumArtFile) {
        musicData.albumArt = albumArtFile
        
    }
    
    dispatch(updateMusicRequested({ id: music._id, data: musicData}))
    setFormData({ title: '', artist: '', album: '', albumArt: '', genres: [] })
    setAlbumArtFile(null)
    onClose()
  }

  function handleClose() {
    setFormData({ title: '', artist: '', album: '', albumArt: '', genres: [] })
    setAlbumArtFile(null)
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
        <h3 style={{ marginTop: 0 }}> Edit {music.title} </h3>
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
            placeholder="Album *" 
            value={formData.album} 
            onChange={(e) => setFormData({...formData, album: e.target.value})} 
          />
          <TextInput 
            placeholder="Genres * (comma separated)" 
            value={formData.genres.join(', ')} 
            onChange={(e) => setFormData({...formData, genres: e.target.value
              .split(',')
              .map((g: string) => g.trim())
              .filter((g: string) => g.length > 0),
            })} 
          />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#a1a1aa' }}>
              Album Art
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAlbumArtFile(e.target.files?.[0] || null)}
              style={{ 
                width: '100%', 
                padding: 8, 
                border: '1px solid #374151', 
                borderRadius: 4, 
                background: 'transparent',
                color: 'white'
              }}
            />
            {albumArtFile && (
              <div style={{ marginTop: 8, fontSize: 10, color: '#10b981' }}>
                Selected: {albumArtFile.name}
              </div>
            )}
          </div>
          <Row>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Edit Music'}
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
