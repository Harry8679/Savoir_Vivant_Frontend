import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { router } from '@router/index'
import { useAuthStore } from '@store/authStore'
import { authService } from '@services/auth.service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

// Applique le thème sauvegardé avant le premier rendu
const saved = localStorage.getItem('savoirvivant-theme')
const parsed = saved ? JSON.parse(saved) : null
const initialTheme = parsed?.state?.theme ?? 'dark'
document.documentElement.setAttribute('data-theme', initialTheme)

// Restaure la session au démarrage
const { refreshToken, accessToken, setTokens, logout } = useAuthStore.getState()
if (refreshToken && !accessToken) {
  authService.refresh(refreshToken)
    .then(data => setTokens(data.accessToken, data.refreshToken))
    .catch(() => logout())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)