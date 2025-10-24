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
  fetchStatisticsFailed,
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
  type MusicQueryParams,
} from '../services/api'

/* ------------------------------- AUTH WORKERS ------------------------------- */
function* loginWorker(action: ReturnType<typeof loginRequested>) {
  try {
    const response: AuthResponse = yield call(authApi.login, action.payload)
    yield call(tokenManager.setToken, response.data.token)
    yield put(authSucceeded(response))
    yield put(
      pushToast({
        title: 'Welcome back!',
        description: `Logged in as ${response.data.user.username}`,
      })
    )
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
    yield put(
      pushToast({
        title: 'Account created!',
        description: `Welcome ${response.data.user.username}`,
      })
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed'
    yield put(authFailed(message))
    yield put(pushToast({ title: 'Signup failed', description: message }))
  }
}

function* logoutWorker() {
  try {
    yield call(authApi.logout)
  } finally {
    yield call(tokenManager.removeToken)
    yield put(logoutCompleted())
    yield put(pushToast({ title: 'Logged out', description: 'See you next time!' }))
  }
}

/* ------------------------------ MUSIC WORKERS ------------------------------- */

function* fetchMusicWorker(action: ReturnType<typeof fetchMusicRequested>) {
  try {
    // Prepare params for API
    const params: MusicQueryParams = action.payload || {}
    const response: GetMusicList = yield call(musicApi.getMusic, params)

    // Normalize pagination (based on your API sample)
    const pagination = {
      currentPage: response.page ?? 1,
      totalPages: response.pages ?? 1,
      totalItems: response.total ?? response.data?.length ?? 0,
      itemsPerPage: response.count ?? response.data?.length ?? 0,
    }

    yield put(fetchMusicSucceeded({ ...response, pagination }))
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

    if ('albumArt' in action.payload && action.payload.albumArt instanceof File) {
      const musicData = action.payload as CreateMusicData
      newMusic = yield call(musicApi.createMusicWithFile, musicData)
    } else {
      const musicData = action.payload as Omit<Music, 'id'>
      newMusic = yield call(musicApi.createMusic, musicData)
    }

    yield put(pushToast({ title: 'Success', description: `Created "${newMusic.title}"` }))
    // Re-fetch current list (will use current filters/query/page from Redux)
    yield put(fetchMusicRequested(undefined))
    yield put(fetchStatisticsRequested())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* updateMusicWorker(action: ReturnType<typeof updateMusicRequested>) {
  try {
    const { id, data } = action.payload as { id: string; data: UpdateMusicData }
    if (!id) throw new Error('Music ID is required for update')

    let updatedMusic: UpdateMusicResponse
    if (
      data.albumArt instanceof File ||
      Object.values(data).some((value) => value instanceof File)
    ) {
      updatedMusic = yield call(musicApi.updateMusicWithFile, id, data)
    } else {
      updatedMusic = yield call(musicApi.updateMusic, id, data)
    }

    yield put(
      pushToast({
        title: 'Success',
        description: `Updated ${updatedMusic.data?.music.title}`,
      })
    )
    yield put(fetchMusicRequested(undefined))
    yield put(fetchStatisticsRequested())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

function* deleteMusicWorker(action: ReturnType<typeof deleteMusicRequested>) {
  try {
    const { id } = action.payload
    if (!id) throw new Error('Music ID is required for deletion')

    yield call(musicApi.deleteMusic, id)
    yield put(pushToast({ title: 'Success', description: 'Music deleted' }))
    yield put(fetchMusicRequested(undefined))
    yield put(fetchStatisticsRequested())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete music'
    yield put(pushToast({ title: 'Error', description: message }))
  }
}

/* ------------------------------- ROOT SAGA --------------------------------- */
export default function* rootSaga() {
  yield all([
    // Auth
    takeLatest(loginRequested.type, loginWorker),
    takeLatest(signupRequested.type, signupWorker),
    takeLatest(logoutRequested.type, logoutWorker),

    // Music
    takeLatest(fetchMusicRequested.type, fetchMusicWorker),
    takeLatest(createMusicRequested.type, createMusicWorker),
    takeLatest(updateMusicRequested.type, updateMusicWorker),
    takeLatest(deleteMusicRequested.type, deleteMusicWorker),

    // Stats
    takeLatest(fetchStatisticsRequested.type, fetchStatisticsWorker),
  ])
}
