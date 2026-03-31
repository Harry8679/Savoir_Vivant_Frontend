import axios from 'axios'
import { useAuthStore } from '@store/authStore'

const api = axios.create({
  baseURL:         'http://localhost:5000/api',
  withCredentials: true,
})

// Intercepteur request — ajoute toujours le token
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Si c'est pas du multipart, force JSON
  if (!config.headers['Content-Type'] ||
      !String(config.headers['Content-Type']).includes('multipart')) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

// Intercepteur response — refresh automatique si 401
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject:  (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token!))
  failedQueue = []
}

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing    = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) throw new Error('Pas de refresh token')

        const { data } = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          { refreshToken }
        )

        const newAccessToken  = data.data.accessToken
        const newRefreshToken = data.data.refreshToken

        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken)
        processQueue(null, newAccessToken)
        original.headers.Authorization = `Bearer ${newAccessToken}`
        return api(original)

      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        window.location.href = '/connexion'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api