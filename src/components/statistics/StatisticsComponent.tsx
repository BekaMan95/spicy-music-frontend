import { useEffect } from 'react'
import styled from '@emotion/styled'
import { Surface } from '../ui'
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchStatisticsRequested } from '../../store/slices/musicSlice';



const StatsContainer = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 16,
  marginBottom: 24,
})

const StatCard = styled(Surface)({
  padding: 16,
  textAlign: 'center',
})

const StatNumber = styled.div({
  fontSize: 32,
  fontWeight: 'bold',
  color: '#10b981',
  marginBottom: 8,
})

const StatLabel = styled.div({
  color: '#a1a1aa',
  fontSize: 14,
})

const ChartContainer = styled.div({
  marginBottom: 24,
})

const ChartTitle = styled.h4({
  margin: '0 0 16px 0',
  color: '#f3f4f6',
})

const GenreBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginBottom: 8,
})

const GenreLabel = styled.div({
  minWidth: 120,
  fontSize: 14,
  color: '#a1a1aa',
})

const GenreBarFill = styled.div<{ width: number }>(({ width }) => ({
  height: 20,
  backgroundColor: '#10b981',
  borderRadius: 4,
  width: `${width}%`,
  marginLeft: 12,
  transition: 'width 0.3s ease',
}))

const ArtistCard = styled(Surface)({
  padding: 12,
  marginBottom: 8,
})

const ArtistName = styled.div({
  fontWeight: 600,
  color: '#f3f4f6',
  marginBottom: 4,
})

const ArtistDetails = styled.div({
  fontSize: 12,
  color: '#a1a1aa',
})

export function StatisticsComponent() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((s) => s.music.statistics?.data);
  const isLoading = useAppSelector((s) => s.music.isLoading);

useEffect(() => {
  dispatch(fetchStatisticsRequested());
}, [dispatch]);


  if (isLoading) {
    return (
      <Surface style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Statistics</h3>
        <div style={{ textAlign: 'center', color: '#a1a1aa' }}>Loading statistics...</div>
      </Surface>
    )
  }

  if (!stats) {
    return (
      <Surface style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>Statistics</h3>
        <div style={{ textAlign: 'center', color: '#a1a1aa' }}>Failed to load statistics</div>
      </Surface>
    )
  }

  const maxGenreCount = Math.max(...stats.songsPerGenre.map(g => g.count))

  return (
    <Surface style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Music Statistics</h3>
      
      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.totals.songs}</StatNumber>
          <StatLabel>Total Songs</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totals.artists}</StatNumber>
          <StatLabel>Artists</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totals.albums}</StatNumber>
          <StatLabel>Albums</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totals.genres}</StatNumber>
          <StatLabel>Genres</StatLabel>
        </StatCard>
      </StatsContainer>

      <ChartContainer>
        <ChartTitle>Songs by Genre</ChartTitle>
        {stats.songsPerGenre.map((genre) => (
          <GenreBar key={genre._id}>
            <GenreLabel>{genre._id}</GenreLabel>
            <GenreBarFill width={(genre.count / maxGenreCount) * 100} />
            <span style={{ marginLeft: 8, fontSize: 12, color: '#a1a1aa' }}>
              {genre.count}
            </span>
          </GenreBar>
        ))}
      </ChartContainer>

      <ChartContainer>
        <ChartTitle>Top Artists</ChartTitle>
        {stats.artistStats.slice(0, 5).map((artist) => (
          <ArtistCard key={artist._id}>
            <ArtistName>{artist.artist}</ArtistName>
            <ArtistDetails>
              {artist.songCount} songs • {artist.albumCount} albums
            </ArtistDetails>
          </ArtistCard>
        ))}
      </ChartContainer>
    </Surface>
  )
}
