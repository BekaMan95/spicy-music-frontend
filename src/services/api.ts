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
  id: string
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
  id: string
  title: string
  artist: string
  album?: string
  albumArt: string
  genres: string[]
}

export interface GetMusicList {
  message: string
  data: Music[]
}


// Mock API base URL - replace with your actual API
const API_BASE = 'http://localhost:3000/api'

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
      credentials: "include",
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

  async updateMusic(id: string, musicData: Partial<Music>): Promise<Music> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE}/music/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(musicData),
    })
    return handleResponse<Music>(response)
  },

  async deleteMusic(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE}/music/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
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
