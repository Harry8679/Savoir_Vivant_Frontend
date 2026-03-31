import { useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import { authService } from '@services/auth.service'

export const useInitAuth = () => {
  const { refreshToken, accessToken, setTokens, logout } = useAuthStore()

  useEffect(() => {
    if (refreshToken && !accessToken) {
      authService.refresh(refreshToken)
        .then(data => setTokens(data.accessToken, data.refreshToken))
        .catch(() => logout())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}