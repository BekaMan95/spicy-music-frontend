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
  fetchStatisticsRequested,
  fetchStatisticsSucceeded,
  fetchStatisticsFailed
} from './slices/musicSlice'
import { pushToast } from './slices/toastSlice'
import { 
  authApi, 
  musicApi, 
  tokenManager, 
  type AuthResponse, 
  type GetMusicList, 
  type Music,
  type CreateMusicData,
  type UpdateMusicData,
  type UpdateMusicResponse,
  type GetStatisticsResponse,
} from '../services/api'

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

function* fetchStatisticsWorker() {
  try {
    const statistics: GetStatisticsResponse = yield call(musicApi.getStatistics)
    yield put(fetchStatisticsSucceeded(statistics))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load statistics'
    yield put(fetchStatisticsFailed(message))
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* createMusicWorker(action: ReturnType<typeof createMusicRequested>) {
  try {
    let newMusic: Music
    
    // Check if payload has albumArt as File (CreateMusicData) or string (Omit<Music, 'id'>)
    if ('albumArt' in action.payload && action.payload.albumArt instanceof File) {
      const musicData = action.payload as CreateMusicData
      newMusic = yield call(musicApi.createMusicWithFile, musicData)
    } else {
      const musicData = action.payload as Omit<Music, 'id'>
      newMusic = yield call(musicApi.createMusic, musicData)
    }
    
    yield put(pushToast({ title: 'Success', description: `Created "${newMusic.title}"` }))
    yield call(fetchMusicWorker)
    yield call(fetchStatisticsWorker)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* updateMusicWorker(action: ReturnType<typeof updateMusicRequested>) {
  try {
    let updatedMusic: UpdateMusicResponse
    
    // Check if payload has id and data structure (new format) or is a Music object (legacy format)
    // if ('data' in action.payload && 'id' in action.payload) {
    const { id, data } = action.payload as { id: string; data: UpdateMusicData }
    if (!id) {
      throw new Error('Music ID is a must for update')
    }
    
    // Check if data contains File (FormData) or regular data
    if (data.albumArt instanceof File || Object.values(data).some(value => value instanceof File)) {
      updatedMusic = yield call(musicApi.updateMusicWithFile, id, data)
    } else {
      updatedMusic = yield call(musicApi.updateMusic, id, data)
    }
    // } else {
    //   // Legacy format - Music object
    //   const musicData = action.payload as Music
    //   const { _id, ...updateData } = musicData
    //   if (!_id) {
    //     throw new Error('Music ID is required for update')
    //   }
      
    //   updatedMusic = yield call(musicApi.updateMusic, _id, updateData)
    // }
    // console.log(JSON.stringify(updatedMusic), updatedMusic);
    yield put(pushToast({ title: 'Success', description: `Updated ${updatedMusic.data?.music.title}` }))
    yield call(fetchMusicWorker)
    yield call(fetchStatisticsWorker)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* deleteMusicWorker(action: ReturnType<typeof deleteMusicRequested>) {
  try {
    if (!action.payload.id) {
      throw new Error('Music ID is required for deletion')
    }
    yield call(musicApi.deleteMusic, action.payload.id)
    yield put(pushToast({ title: 'Success', description: 'Music deleted' }))
    yield call(fetchMusicWorker)
    yield call(fetchStatisticsWorker)
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
    takeLatest(fetchStatisticsRequested.type, fetchStatisticsWorker),
  ])
}