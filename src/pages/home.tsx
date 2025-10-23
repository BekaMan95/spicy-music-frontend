import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, TextInput, Surface, Row, Col, ModalContainer } from '../components/ui'
import { useAppDispatch, useAppSelector } from '../store'
import { fetchMusicRequested, setQuery, setFilters, updateMusicRequested, deleteMusicRequested } from '../store/slices/musicSlice'
import { type Music } from '../services/api'
import { AddMusicModal } from '../components/music/AddMusicModal'
import { StatisticsComponent } from '../components/statistics/StatisticsComponent'
import { EditMusicModal } from '../components/music/EditMusicModal'

const Grid = styled.div({ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, padding: 20 })
const Card = styled(Surface)({ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
const AlbumArt = styled.img({
  width: 60,
  height: 60,
  borderRadius: 8,
  objectFit: 'cover',
  marginRight: 16,
})
const DefaultAlbumArt = styled.div({
  width: 60,
  height: 60,
  borderRadius: 8,
  backgroundColor: '#374151',
  marginRight: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9CA3AF',
  fontSize: 24,
})

export function HomePage() {
  const dispatch = useAppDispatch()
  const { items, query, filters, isLoading } = useAppSelector((s) => s.music)
  const [editing, setEditing] = useState<Music | null>(null)
  const [deleting, setDeleting] = useState<Music | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);

  useEffect(() => { dispatch(fetchMusicRequested()) }, [dispatch])

  function handleUpdate() {
    if (!editing) return
    dispatch(updateMusicRequested(editing))
    setEditing(null)
  }

  function handleDelete() {
    if (!deleting) return
    dispatch(deleteMusicRequested({ id: deleting._id }))
    setDeleting(null)
  }

  return (
    <Grid>
      <div>
        <Surface style={{ padding: 16, marginBottom: 12 }}>
          <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Row style={{ flex: 1, gap: 12 }}>
              <TextInput placeholder="Search" value={query} onChange={(e) => dispatch(setQuery(e.target.value))} />
              <TextInput placeholder="Filter by tag" value={filters.tag ?? ''} onChange={(e) => dispatch(setFilters({ tag: e.target.value }))} />
            </Row>
            <Button onClick={() => setShowAddModal(true)}>
              Add Music
            </Button>
          </Row>
        </Surface>

        <Col>
          {isLoading && items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#a1a1aa' }}>Loading music...</div>
          ) : (
            items.map((m) => (
              <Card key={m._id}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {m.albumArt ? (
                    <AlbumArt src={m.albumArt} alt={`${m.title} album art`} />
                  ) : (
                    <DefaultAlbumArt>🎵</DefaultAlbumArt>
                  )}
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.title}</div>
                    <div style={{ color: '#a1a1aa', fontSize: 14 }}>{m.artist} {m.album ? `· ${m.album}` : ''}</div>
                  </div>
                </div>
                <Row>
                  <Button onClick={() => setEditingMusic(m)} disabled={isLoading}>Edit</Button>
                  <Button onClick={() => setDeleting(m)} disabled={isLoading} style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Delete</Button>
                </Row>
              </Card>
            ))
          )}
        </Col>
      </div>
      <StatisticsComponent />

      {editing && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setEditing(null)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Edit: {editing.title}</h3>
            <Col>
              <TextInput placeholder="Title" value={editing.title} onChange={(e) => setEditing({...editing, title: e.target.value})} />
              <TextInput placeholder="Artist" value={editing.artist} onChange={(e) => setEditing({...editing, artist: e.target.value})} />
              <TextInput placeholder="Album" value={editing.album || ''} onChange={(e) => setEditing({...editing, album: e.target.value})} />
            </Col>
            <Row>
              <Button onClick={handleUpdate} disabled={isLoading}>Save</Button>
              <Button onClick={() => setEditing(null)} style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Cancel</Button>
            </Row>
          </ModalContainer>
        </div>
      )}

      {deleting && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setDeleting(null)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Delete: {deleting.title}?</h3>
            <Row>
              <Button onClick={handleDelete} disabled={isLoading}>Confirm</Button>
              <Button onClick={() => setDeleting(null)} style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}>Cancel</Button>
            </Row>
          </ModalContainer>
        </div>
      )}

      <AddMusicModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      {editingMusic && (
        <EditMusicModal
          isOpen={true}
          onClose={() => setEditingMusic(null)}
          music={editingMusic}
        />
      )}
    </Grid>
  )
}


