import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type User, type AuthResponse } from '../../services/api'

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
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
    },
    authFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    logoutCompleted(state) {
      state.user = null
      state.token = null
      state.isLoading = false
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
} = authSlice.actions

export default authSlice.reducer


