// API service functions for all operations

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  username: string
  email: string
  password: string
}

export interface User {
  _id: string
  username: string
  email: string
  profilePic?: string
}

export interface GetProfileResponse {
  message: string
  data: {
    user: User
  }
}

export interface AuthResponse {
  message: string
  data: {
    user: User
    token: string
  }
}

export interface Music {
  _id: string
  title: string
  artist: string
  album: string
  albumArt: string
  genres: string[]
}

export interface CreateMusicData {
  title: string
  artist: string
  album: string
  albumArt: File
  genres: string[]
}

export interface UpdateMusicData {
  title?: string
  artist?: string
  album?: string
  albumArt?: File
  genres?: string[]
}

export interface UpdateMusicResponse {
  success: boolean
  message: string
  data?: {
    music: Music
  }
}

export interface GetMusicList {
  message: string
  data: Music[]
}

export interface Statistics {
  totals: {
    songs: number
    artists: number
    albums: number
    genres: number
  }
  songsPerGenre: Array<{
    _id: string
    count: number
  }>
  artistStats: Array<{
    _id: string
    songCount: number
    albums: string[]
    artist: string
    albumCount: number
    artistLower: string
  }>
  albumStats: Array<{
    _id: {
      artist: string
      album: string
    }
    songCount: number
    artist: string
    album: string
    albumLower: string
  }>
}

export interface GetStatisticsResponse {
  success: boolean
  message: string
  data: Statistics
}


// Mock API base URL - replace with your actual API
const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error((error as { message: string }).message || `HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

// Auth API functions
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    return handleResponse<AuthResponse>(response)
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    return handleResponse<AuthResponse>(response)
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE}/users/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
  },

  async getProfile(): Promise<User> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return handleResponse<User>(response)
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
    return handleResponse<User>(response)
  },

  async updateProfileWithFile(formData: FormData): Promise<User> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    return handleResponse<User>(response)
  },
}

// Music API functions
export const musicApi = {
  async getMusic(): Promise<Music[]> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return handleResponse<Music[]>(response)
  },

  async createMusic(musicData: Omit<Music, 'id'>): Promise<Music> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(musicData),
    })
    return handleResponse<Music>(response)
  },

  async createMusicWithFile(musicData: CreateMusicData): Promise<Music> {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    
    formData.append('title', musicData.title)
    formData.append('artist', musicData.artist)
    formData.append('album', musicData.album)
    formData.append('albumArt', musicData.albumArt)
    
    // Append each genre as a separate field
    musicData.genres.forEach((genre, index) => {
      formData.append(`genres[${index}]`, genre)
    })
    
    const response = await fetch(`${API_BASE}/music`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    return handleResponse<Music>(response)
  },

  async updateMusic(id: string, musicData: UpdateMusicData): Promise<UpdateMusicResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(musicData),
    })
    return handleResponse<UpdateMusicResponse>(response)
  },

  async updateMusicWithFile(id: string, musicData: UpdateMusicData): Promise<UpdateMusicResponse> {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    
    if (musicData.title) formData.append('title', musicData.title)
    if (musicData.artist) formData.append('artist', musicData.artist)
    if (musicData.album) formData.append('album', musicData.album)
    if (musicData.albumArt) formData.append('albumArt', musicData.albumArt)
    
    // Append genres if provided
    if (musicData.genres) {
      musicData.genres.forEach((genre, index) => {
        formData.append(`genres[${index}]`, genre)
      })
    }
    
    const response = await fetch(`${API_BASE}/music/${id}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    return handleResponse<UpdateMusicResponse>(response)
  },

  async deleteMusic(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE}/music/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  },

  async getStatistics(): Promise<GetStatisticsResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music/statistics`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    return handleResponse<GetStatisticsResponse>(response)
  },
}

// Token management
export const tokenManager = {
  setToken(token: string): void {
    localStorage.setItem('token', token)
  },
  
  getToken(): string | null {
    return localStorage.getItem('token')
  },
  
  removeToken(): void {
    localStorage.removeItem('token')
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
