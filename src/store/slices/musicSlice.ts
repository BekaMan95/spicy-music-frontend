import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type GetMusicList, type Music } from '../../services/api'

type MusicState = {
  items: Music[]
  isLoading: boolean
  error: string | null
  query: string
  filters: { tag?: string }
}

const initialState: MusicState = {
  items: [],
  isLoading: false,
  error: null,
  query: '',
  filters: {},
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    fetchMusicRequested(state) {
      state.isLoading = true
      state.error = null
    },
    fetchMusicSucceeded(state, action: PayloadAction<GetMusicList>) {
      state.items = action.payload.data
      state.isLoading = false
    },
    fetchMusicFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setFilters(state, action: PayloadAction<{ tag?: string }>) {
      state.filters = action.payload
    },
    createMusicRequested(state, _action: PayloadAction<Omit<Music, 'id'>>) {
      state.isLoading = true
      state.error = null
    },
    updateMusicRequested(state, _action: PayloadAction<Music>) {
      state.isLoading = true
      state.error = null
    },
    deleteMusicRequested(state, _action: PayloadAction<{ id: string }>) {
      state.isLoading = true
      state.error = null
    },
  },
})

export const {
  fetchMusicRequested,
  fetchMusicSucceeded,
  fetchMusicFailed,
  setQuery,
  setFilters,
  createMusicRequested,
  updateMusicRequested,
  deleteMusicRequested,
} = musicSlice.actions

export default musicSlice.reducer


