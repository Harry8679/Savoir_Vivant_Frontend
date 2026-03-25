import { useEffect } from 'react'
import { useThemeStore } from '@store/themeStore'

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '100px',
        border: '1px solid var(--color-border)',
        background: isDark ? 'var(--color-surface-2)' : '#e2d9cc',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.3s',
        flexShrink: 0,
        padding: 0,
      }}
    >
      {/* Track icons */}
      <span style={{
        position: 'absolute',
        left: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '10px',
        opacity: isDark ? 0.5 : 0,
        transition: 'opacity 0.2s',
        lineHeight: 1,
      }}>🌙</span>
      <span style={{
        position: 'absolute',
        right: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '10px',
        opacity: isDark ? 0 : 0.7,
        transition: 'opacity 0.2s',
        lineHeight: 1,
      }}>☀️</span>

      {/* Thumb */}
      <span style={{
        position: 'absolute',
        top: '2px',
        left: isDark ? '2px' : '20px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: isDark ? '#6366f1' : '#d97706',
        transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
        display: 'block',
      }} />
    </button>
  )
}