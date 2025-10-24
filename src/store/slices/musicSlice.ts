import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  type GetMusicList,
  type Music,
  type CreateMusicData,
  type UpdateMusicData,
  type GetStatisticsResponse,
  type MusicQueryParams
} from '../../services/api'

type MusicState = {
  items: Music[]
  isLoading: boolean
  error: string | null
  query: string
  filters: {
    artist?: string
    album?: string
    genre?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
  statistics: GetStatisticsResponse | null
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

type CreateMusicPayload = CreateMusicData | Omit<Music, 'id'>
type UpdateMusicPayload = { id: string; data: UpdateMusicData } | Music

const initialState: MusicState = {
  items: [],
  isLoading: false,
  error: null,
  query: '',
  filters: {},
  statistics: null,
  pagination: undefined
}

const musicSlice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    fetchMusicRequested(state, _action: PayloadAction<MusicQueryParams | undefined>) {
      state.isLoading = true
      state.error = null
    },
    fetchMusicSucceeded(state, action: PayloadAction<GetMusicList & { count?: number; total?: number; page?: number; pages?: number }>) {
      state.items = action.payload.data
      state.isLoading = false
      state.error = null

      // 🟢 Fix: properly map pagination data
      state.pagination = {
        currentPage: action.payload.page ?? 1,
        totalPages: action.payload.pages ?? 1,
        totalItems: action.payload.total ?? action.payload.data.length,
        itemsPerPage: action.payload.count ?? action.payload.data.length
      }
    },
    fetchMusicFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setFilters(
      state,
      action: PayloadAction<{
        artist?: string
        album?: string
        genre?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
      }>
    ) {
      state.filters = action.payload
    },
    createMusicRequested(state, _action: PayloadAction<CreateMusicPayload>) {
      state.isLoading = true
      state.error = null
    },
    updateMusicRequested(state, _action: PayloadAction<UpdateMusicPayload>) {
      state.isLoading = true
      state.error = null
    },
    deleteMusicRequested(state, _action: PayloadAction<{ id: string }>) {
      state.isLoading = true
      state.error = null
    },
    fetchStatisticsRequested(state) {
      state.isLoading = true
      state.error = null
    },
    fetchStatisticsSucceeded(state, action: PayloadAction<GetStatisticsResponse>) {
      state.statistics = action.payload
      state.isLoading = false
    },
    fetchStatisticsFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    }
  }
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
  fetchStatisticsRequested,
  fetchStatisticsSucceeded,
  fetchStatisticsFailed
} = musicSlice.actions

export default musicSlice.reducer
