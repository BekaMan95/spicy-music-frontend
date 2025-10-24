import { useEffect, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { debounce } from 'lodash'
import {
  Button,
  TextInput,
  Surface,
  Row,
  Col,
  ModalContainer
} from '../components/ui'
import { useAppDispatch, useAppSelector } from '../store'
import {
  fetchMusicRequested,
  setQuery,
  setFilters,
  updateMusicRequested,
  deleteMusicRequested
} from '../store/slices/musicSlice'
import { type Music } from '../services/api'
import { AddMusicModal } from '../components/music/AddMusicModal'
import { StatisticsComponent } from '../components/statistics/StatisticsComponent'
import { EditMusicModal } from '../components/music/EditMusicModal'

// ------------------- existing styled components -------------------
const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: 16,
  padding: 20
})
const Card = styled(Surface)({
  padding: 16,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
})
const AlbumArt = styled.img({
  width: 60,
  height: 60,
  borderRadius: 8,
  objectFit: 'cover',
  marginRight: 16
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
  fontSize: 24
})
const Select = styled.select(({ theme }) => ({
  background: theme.colors.surface,
  color: theme.colors.text,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md,
  padding: '8px 12px',
  fontSize: 14,
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.accent
  }
}))
const MusicLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  '&:hover': {
    opacity: 0.8
  }
})

// ------------------- NEW pagination styles -------------------
const PaginationContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  marginTop: 20
})

const PageButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  padding: '6px 10px',
  borderRadius: 6,
  fontSize: 14,
  background: active ? '#e35f00' : 'transparent',
  color: active ? 'black' : 'white',
  border: '1px solid #e35f00',
  cursor: 'pointer'
}))

// -----------------------------------------------------------------

export function HomePage() {
  const dispatch = useAppDispatch()
  const { items, query, filters, isLoading, pagination } = useAppSelector(
    (s) => s.music
  )
  const [editing, setEditing] = useState<Music | null>(null)
  const [deleting, setDeleting] = useState<Music | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMusic, setEditingMusic] = useState<Music | null>(null)
  const [localQuery, setLocalQuery] = useState(query)

  // Debounce search updates
  const debouncedQueryUpdate = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(setQuery(value))
      }, 500),
    [dispatch]
  )

  useEffect(() => {
    debouncedQueryUpdate(localQuery)
  }, [localQuery, debouncedQueryUpdate])

  // Fetch music whenever query or filters change
  useEffect(() => {
    const params = {
      search: query || undefined,
      artist: filters.artist || undefined,
      album: filters.album || undefined,
      genre: filters.genre || undefined,
      sortBy: filters.sortBy || undefined,
      sortOrder: filters.sortOrder || undefined,
      page: pagination?.currentPage || 1
    }
    dispatch(fetchMusicRequested(params))
  }, [dispatch, query, filters, pagination?.currentPage])

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

  function handleFilterChange(field: keyof typeof filters, value: string) {
    dispatch(setFilters({ ...filters, [field]: value || undefined }))
  }

  // NEW: pagination handler
  const goToPage = (page: number) => {
    if (!pagination) return
    if (page < 1 || page > pagination.totalPages) return
    dispatch(
      fetchMusicRequested({
        search: query || undefined,
        ...filters,
        page
      })
    )
  }

  return (
    <Grid>
      <div>
        <Surface style={{ padding: 16, marginBottom: 12 }}>
          <Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}
          >
            <TextInput
              placeholder="Search by title, artist, or album..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              style={{ flex: 1, marginRight: 12 }}
            />
            <Button onClick={() => setShowAddModal(true)}>Add Music</Button>
          </Row>
          <Row style={{ gap: 12, flexWrap: 'wrap' }}>
            <Select
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Electronic">Electronic</option>
              <option value="Country">Country</option>
              <option value="R&B">R&B</option>
              <option value="Metal">Metal</option>
              <option value="Alternative">Alternative</option>
              <option value="Indie">Indie</option>
              <option value="Soul">Soul</option>
            </Select>
            <Select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
              <option value="createdAt">Date Added</option>
            </Select>
            <Select
              value={filters.sortOrder || ''}
              onChange={(e) =>
                handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')
              }
            >
              <option value="">Order</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </Row>
        </Surface>

        <Col>
          {isLoading && items.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#a1a1aa'
              }}
            >
              Loading music...
            </div>
          ) : items.length === 0 ? (
            // 🆕 No results message
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#a1a1aa'
              }}
            >
              No Music found
            </div>
          ) : (
            items.map((m) => (
              <Card key={m._id}>
                <MusicLink
                  to={`/music/${m._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  {m.albumArt ? (
                    <AlbumArt src={m.albumArt} alt={`${m.title} album art`} />
                  ) : (
                    <DefaultAlbumArt>🎵</DefaultAlbumArt>
                  )}
                  <div>
                    <div style={{ fontWeight: 700 }}>{m.title}</div>
                    <div style={{ color: '#a1a1aa', fontSize: 14 }}>
                      {m.artist} · {m.album}
                    </div>
                  </div>
                </MusicLink>
                <Row>
                  <Button onClick={() => setEditingMusic(m)} disabled={isLoading}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleting(m)}
                    disabled={isLoading}
                    style={{
                      background: 'transparent',
                      color: 'white',
                      border: '1px solid #2e2e32'
                    }}
                  >
                    Delete
                  </Button>
                </Row>
              </Card>
            ))
          )}
        </Col>

        {/* ------------------- PAGINATION SECTION ------------------- */}
        {pagination && pagination.totalPages > 0 && (
          <PaginationContainer>
            <Button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Prev
            </Button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <PageButton
                  key={page}
                  active={page === pagination.currentPage}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </PageButton>
              )
            )}

            <Button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </PaginationContainer>
        )}
        {/* ----------------------------------------------------------- */}
      </div>

      <StatisticsComponent />

      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0,0,0,0.5)'
          }}
          onClick={() => setEditing(null)}
        >
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Edit: {editing.title}</h3>
            <Col>
              <TextInput
                placeholder="Title"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
              <TextInput
                placeholder="Artist"
                value={editing.artist}
                onChange={(e) =>
                  setEditing({ ...editing, artist: e.target.value })
                }
              />
              <TextInput
                placeholder="Album"
                value={editing.album || ''}
                onChange={(e) =>
                  setEditing({ ...editing, album: e.target.value })
                }
              />
            </Col>
            <Row>
              <Button onClick={handleUpdate} disabled={isLoading}>
                Save
              </Button>
              <Button
                onClick={() => setEditing(null)}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid #2e2e32'
                }}
              >
                Cancel
              </Button>
            </Row>
          </ModalContainer>
        </div>
      )}

      {deleting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0,0,0,0.5)'
          }}
          onClick={() => setDeleting(null)}
        >
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Delete: {deleting.title}?</h3>
            <Row>
              <Button onClick={handleDelete} disabled={isLoading}>
                Confirm
              </Button>
              <Button
                onClick={() => setDeleting(null)}
                style={{
                  background: 'transparent',
                  color: 'white',
                  border: '1px solid #2e2e32'
                }}
              >
                Cancel
              </Button>
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
