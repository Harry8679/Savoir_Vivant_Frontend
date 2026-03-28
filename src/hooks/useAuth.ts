import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@services/auth.service'
import { useAuthStore } from '@store/authStore'
import { LoginPayload, RegisterPayload } from '@/types/auth.types'
// import { RegisterPayload, LoginPayload } from '@types/auth.types'

export const useAuth = () => {
  const navigate      = useNavigate()
  const { setAuth, logout: storeLogout } = useAuthStore()
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string>('')

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true)
      setError('')
      const result = await authService.register(payload)
      setAuth(result.user, result.accessToken, result.refreshToken)
      navigate('/')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Erreur lors de l\'inscription'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true)
      setError('')
      const result = await authService.login(payload)
      setAuth(result.user, result.accessToken, result.refreshToken)
      navigate('/')
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Email ou mot de passe incorrect'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore les erreurs de logout
    } finally {
      storeLogout()
      navigate('/login')
    }
  }

  return { register, login, logout, loading, error, setError }
}