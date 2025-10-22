import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import musicReducer from './slices/musicSlice'
import toastReducer from './slices/toastSlice'
import rootSaga from './rootSaga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    music: musicReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


