import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useAppSelector, useAppDispatch } from '../store';
import { Surface, Row, Button } from '../components/ui';
import { fetchMusicRequested } from '../store/slices/musicSlice';
import { EditMusicModal } from '../components/music/EditMusicModal';
import type { Music } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { deleteMusicRequested } from '../store/slices/musicSlice';



const AlbumArt = styled.img({
  width: 120,
  height: 120,
  borderRadius: 12,
  objectFit: 'cover',
  marginRight: 20,
});

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
});

export function MusicPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { items, isLoading } = useAppSelector((s) => s.music);
  const music = items.find((m) => m._id === id);
  const [open, setOpen] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const navigate = useNavigate();


  const title = useMemo(() => music?.title ?? 'Unknown', [music]);

  // Refetch music if state is empty
  useEffect(() => {
    if (!music && items.length === 0) {
      dispatch(fetchMusicRequested());
    }
  }, [music, items.length, dispatch]);

  // Show loading or not found
  if (isLoading || !music) {
    return (
      <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, textAlign: 'center' }}>
        <h2>{isLoading ? 'Loading music...' : 'Music not found'}</h2>
        <p style={{ color: '#a1a1aa' }}>
          {isLoading
            ? 'Please wait while we fetch the music details.'
            : 'The requested music could not be found.'}
        </p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!music?._id) return;
  
    dispatch(deleteMusicRequested({ id: music._id }));
  
    // Optional: wait for deletion to complete via saga or optimistic redirect
    setTimeout(() => {
      navigate('/home');
    }, 500); // adjust delay if needed
  };
  

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20 }}>
      <Surface style={{ padding: 20 }}>
        <Row style={{ alignItems: 'center', marginBottom: 20 }}>
          {music.albumArt ? (
            <AlbumArt src={`/${music.albumArt}`} alt={`${music.title} album art`} />
          ) : (
            <DefaultAlbumArt>🎵</DefaultAlbumArt>
          )}
          <div>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <div style={{ color: '#a1a1aa' }}>
              {music.artist}
              {music.album ? ` · ${music.album}` : ''}
            </div>
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
        <Row style={{ justifyContent: 'flex-end', gap: 8 }}>
          <Button
            onClick={() => {
              setEditingMusic(music);
              setOpen(true);
            }}
            disabled={isLoading}
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            style={{ background: 'transparent', color: 'white', border: '1px solid #2e2e32' }}
          >
            Delete
          </Button>
        </Row>

      </Surface>
      {open && editingMusic && (
        <EditMusicModal
          isOpen={true}
          onClose={() => {
            setEditingMusic(null);
            setOpen(false);
          }}
          music={editingMusic}
        />
      )}
    </div>
  );
}
