import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  loginRequested,
  signupRequested,
  logoutRequested,
  authFailed,
  authSucceeded,
  logoutCompleted,
} from './slices/authSlice'
import {
  fetchMusicRequested,
  fetchMusicFailed,
  fetchMusicSucceeded,
  createMusicRequested,
  updateMusicRequested,
  deleteMusicRequested,
} from './slices/musicSlice'
import { pushToast } from './slices/toastSlice'
import { authApi, musicApi, tokenManager, type AuthResponse, type GetMusicList, type Music } from '../services/api'

function* loginWorker(action: ReturnType<typeof loginRequested>) {
  try {
    const response: AuthResponse = yield call(authApi.login, action.payload)
    yield call(tokenManager.setToken, response.data.token)
    yield put(authSucceeded(response))
    yield put(pushToast({ title: 'Welcome back!', description: `Logged in as ${response.data.user.username}` }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed'
    yield put(authFailed(message))
    yield put(pushToast({ title: 'Login failed', description: message }))
  }
}

function* signupWorker(action: ReturnType<typeof signupRequested>) {
  try {
    const response: AuthResponse = yield call(authApi.signup, action.payload)
    yield call(tokenManager.setToken, response.data.token)
    yield put(authSucceeded(response))
    yield put(pushToast({ title: 'Account created!', description: `Welcome ${response.data.user.username}` }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed'
    yield put(authFailed(message))
    yield put(pushToast({ title: 'Signup failed', description: message }))
  }
}

function* logoutWorker() {
  try {
    yield call(authApi.logout)
    yield call(tokenManager.removeToken)
    yield put(logoutCompleted())
    yield put(pushToast({ title: 'Logged out', description: 'See you next time!' }))
  } catch (error) {
    // Still logout locally even if API call fails
    yield call(tokenManager.removeToken)
    yield put(logoutCompleted())
    yield put(pushToast({ title: 'Logged out', description: 'See you next time!' }))
  }
}

function* fetchMusicWorker() {
  try {
    const music: GetMusicList = yield call(musicApi.getMusic)
    yield put(fetchMusicSucceeded(music))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load music'
    yield put(fetchMusicFailed(message))
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* createMusicWorker(action: ReturnType<typeof createMusicRequested>) {
  try {
    const newMusic: Music = yield call(musicApi.createMusic, action.payload)
    yield put(pushToast({ title: 'Success', description: `Created "${newMusic.title}"` }))
    yield call(fetchMusicWorker)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* updateMusicWorker(action: ReturnType<typeof updateMusicRequested>) {
  try {
    const { id, ...updateData } = action.payload
    const updatedMusic: Music = yield call(musicApi.updateMusic, id, updateData)
    yield put(pushToast({ title: 'Success', description: `Updated "${updatedMusic.title}"` }))
    yield call(fetchMusicWorker)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* deleteMusicWorker(action: ReturnType<typeof deleteMusicRequested>) {
  try {
    yield call(musicApi.deleteMusic, action.payload.id)
    yield put(pushToast({ title: 'Success', description: 'Music deleted' }))
    yield call(fetchMusicWorker)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(loginRequested.type, loginWorker),
    takeLatest(signupRequested.type, signupWorker),
    takeLatest(logoutRequested.type, logoutWorker),
    takeLatest(fetchMusicRequested.type, fetchMusicWorker),
    takeLatest(createMusicRequested.type, createMusicWorker),
    takeLatest(updateMusicRequested.type, updateMusicWorker),
    takeLatest(deleteMusicRequested.type, deleteMusicWorker),
  ])
}