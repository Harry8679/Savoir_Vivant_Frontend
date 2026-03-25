import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'dark' | 'light'
  toggle: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggle: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'savoirvivant-theme' }
  )
)