import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type User, type AuthResponse } from '../../services/api'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

// Load user and token from localStorage if available
const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested(state, _action: PayloadAction<{ email: string; password: string }>) {
      state.isLoading = true
      state.error = null
    },
    signupRequested(state, _action: PayloadAction<{ username: string; email: string; password: string }>) {
      state.isLoading = true
      state.error = null
    },
    logoutRequested(state) {
      state.isLoading = true
      state.error = null
    },
    authSucceeded(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.data.user
      state.token = action.payload.data.token
      state.isLoading = false
      state.error = null

      // Persist user and token in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.data.user))
      localStorage.setItem('token', action.payload.data.token)
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    logoutCompleted(state) {
      state.user = null
      state.token = null
      state.isLoading = false

      // Clear stored data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    updateProfileSucceeded(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isLoading = false

      // Update stored user
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
})

export const {
  loginRequested,
  signupRequested,
  logoutRequested,
  authSucceeded,
  authFailed,
  logoutCompleted,
  updateProfileSucceeded,
} = authSlice.actions

export default authSlice.reducer
