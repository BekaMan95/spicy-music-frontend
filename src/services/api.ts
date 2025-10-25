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
  createrAt: string
  updatedAt: string
}

export interface GetMusicResponse {
  success: boolean
  message: string
  data: {
    music: Music
  }
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

export interface MusicQueryParams {
  page?: number
  limit?: number
  search?: string
  artist?: string
  album?: string
  genre?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface GetMusicList {
  message: string
  data: Music[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  page: number
  pages: number
  total: number
  count: number
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
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(credentials),
    })
    return handleResponse<AuthResponse>(response)
  },

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
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
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'
    })
  },

  async getProfile(): Promise<User> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}` 
      },
      credentials: 'include'
    })
    return handleResponse<User>(response)
  },

  async updateProfile(userData: Partial<User>): Promise<GetProfileResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })
    return handleResponse<GetProfileResponse>(response)
  },

  async updateProfileWithFile(formData: FormData): Promise<GetProfileResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: { 
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    })
    return handleResponse<GetProfileResponse>(response)
  },
}

// Music API functions
export const musicApi = {
  async getMusic(params?: MusicQueryParams): Promise<GetMusicList> {
    const token = localStorage.getItem('token')
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.artist) queryParams.append('artist', params.artist)
      if (params.album) queryParams.append('album', params.album)
      if (params.genre) queryParams.append('genre', params.genre)
      if (params.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    }
    
    const queryString = queryParams.toString()
    const url = queryString ? `${API_BASE}/music?${queryString}` : `${API_BASE}/music`
    
    const response = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}` 
      },
      credentials: 'include',
    })
    return handleResponse<GetMusicList>(response)
  },

  async createMusic(musicData: Omit<Music, 'id'>): Promise<GetMusicResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(musicData),
    })
    return handleResponse<GetMusicResponse>(response)
  },

  async createMusicWithFile(musicData: CreateMusicData): Promise<GetMusicResponse> {
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
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    })
    return handleResponse<GetMusicResponse>(response)
  },

  async updateMusic(id: string, musicData: UpdateMusicData): Promise<UpdateMusicResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
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
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    })
    return handleResponse<UpdateMusicResponse>(response)
  },

  async deleteMusic(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE}/music/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}` 
      },
      credentials: 'include',
    })
  },

  async getStatistics(): Promise<GetStatisticsResponse> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music/statistics`, {
      headers: { 
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Authorization': `Bearer ${token}` 
      },
      credentials: 'include',
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
