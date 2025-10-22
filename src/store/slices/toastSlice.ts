import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ToastItem = { id: string; title: string; description?: string }

type ToastState = { items: ToastItem[] }

const initialState: ToastState = { items: [] }

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<Omit<ToastItem, 'id'>>) {
      state.items.push({ id: String(Date.now()), ...action.payload })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
  },
})

export const { pushToast, removeToast } = toastSlice.actions
export default toastSlice.reducer


