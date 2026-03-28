export interface User {
  id:                 string
  name:               string
  email:              string
  role:               'user' | 'admin'
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due'
  avatarUrl?:         string
}

export interface AuthResponse {
  accessToken:  string
  refreshToken: string
  user:         User
}

export interface RegisterPayload {
  name:     string
  email:    string
  password: string
}

export interface LoginPayload {
  email:    string
  password: string
}

export interface ApiResponse<T> {
  success:  boolean
  data:     T
  message?: string
  errors?:  string[]
}