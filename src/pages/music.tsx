import { useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { useAppSelector, useAppDispatch } from '../store'
import { Surface, Row, Button, ModalContainer, Col, TextInput } from '../components/ui'
import { updateMusicRequested } from '../store/slices/musicSlice'

const AlbumArt = styled.img({
  width: 120,
  height: 120,
  borderRadius: 12,
  objectFit: 'cover',
  marginRight: 20,
})
const DefaultAlbumArt = styled.div({
  width: 120,
  height: 120,
  borderRadius: 12,
  backgroundColor: '#374151',
  marginRight: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9CA3AF',
  fontSize: 48,
})

export function MusicPage() {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { items, isLoading } = useAppSelector((s) => s.music)
  const music = items.find((m) => m._id === id)
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState({
    title: music?.title ?? '',
    artist: music?.artist ?? '',
    album: music?.album ?? '',
  })

  const title = useMemo(() => music?.title ?? 'Unknown', [music])

  function handleSave() {
    if (!music) return
    dispatch(updateMusicRequested({ ...music, ...editData }))
    setOpen(false)
  }

  if (!music) {
    return (
      <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, textAlign: 'center' }}>
        <h2>Music not found</h2>
        <p style={{ color: '#a1a1aa' }}>The requested music could not be found.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <Surface style={{ padding: 20 }}>
        <Row style={{ alignItems: 'center', marginBottom: 20 }}>
          {music.albumArt ? (
            <AlbumArt src={music.albumArt} alt={`${music.title} album art`} />
          ) : (
            <DefaultAlbumArt>🎵</DefaultAlbumArt>
          )}
          <div>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <div style={{ color: '#a1a1aa' }}>{music.artist}{music.album ? ` · ${music.album}` : ''}</div>
            {music.genres && music.genres.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {music.genres.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      display: 'inline-block',
                      background: '#374151',
                      color: '#a1a1aa',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      marginRight: 8,
                      marginBottom: 4,
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Row>
        <Row style={{ justifyContent: 'flex-end' }}>
          <Button onClick={() => setOpen(true)} disabled={isLoading}>Edit</Button>
        </Row>
      </Surface>
      {open && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setOpen(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Edit Track</h3>
            <Col>
              <TextInput 
                placeholder="Title" 
                value={editData.title} 
                onChange={(e) => setEditData({...editData, title: e.target.value})} 
              />
              <TextInput 
                placeholder="Artist" 
                value={editData.artist} 
                onChange={(e) => setEditData({...editData, artist: e.target.value})} 
              />
              <TextInput 
                placeholder="Album" 
                value={editData.album} 
                onChange={(e) => setEditData({...editData, album: e.target.value})} 
              />
            </Col>
            <Row>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={() => setOpen(false)} style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Cancel</Button>
            </Row>
          </ModalContainer>
        </div>
      )}
    </div>
  )
}


