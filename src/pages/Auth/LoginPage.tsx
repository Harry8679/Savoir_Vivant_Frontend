// ─── LoginPage.tsx ─────────────────────────────────────────────────────────
// Chemin : src/pages/Auth/LoginPage.tsx

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'

function Field({
  label, type = 'text', value, onChange, error, placeholder, autoComplete,
}: {
  label: string; type?: string; value: string
  onChange: (v: string) => void; error?: string
  placeholder?: string; autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={type === 'password' ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-3.5 py-3 rounded-xl border text-sm text-gray-900
                      placeholder:text-gray-400 focus:outline-none transition-all ${
            error
              ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
          }`}
        />
        {type === 'password' && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                       hover:text-gray-600 text-xs">
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function LoginPage() {
  const navigate        = useNavigate()
  const [searchParams]  = useSearchParams()
  const { setAuth }     = useAuthStore()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [errors,   setErrors]   = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = 'Email invalide'
    if (!password.trim()) errs.password = 'Mot de passe requis'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setApiError(null)
    try {
      const result = await authService.login({ email, password })
      setAuth(result.user, result.accessToken, result.refreshToken)
      navigate(searchParams.get('redirect') ?? '/catalogue')
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : 'Email ou mot de passe incorrect'
      setApiError(message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex">
      {/* Panel gauche décoratif */}
      <div className="hidden lg:flex flex-col justify-between w-1/2
                      bg-linear-to-br from-indigo-600 to-violet-700 p-12 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center
                          justify-center text-lg">📖</div>
          <span className="font-extrabold text-lg">SavoirVivant</span>
        </Link>
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Bon retour sur<br />
            <span className="text-indigo-200">SavoirVivant</span>
          </h2>
          <p className="text-indigo-200 text-base leading-relaxed max-w-md">
            Accédez à votre bibliothèque de livres pédagogiques couvrant les
            mathématiques, la physique, l'informatique et les langues.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📚', label: 'Bibliothèque illimitée', sub: 'Abonnement 9€/mois' },
              { icon: '🎓', label: '5 niveaux par livre',   sub: 'Collège → MP/PC' },
              { icon: '📱', label: 'Lecture partout',       sub: 'Web, iOS, Android' },
              { icon: '🔄', label: 'Mises à jour gratuites',sub: 'Contenu toujours frais' },
            ].map(f => (
              <div key={f.label} className="bg-white/10 rounded-xl p-3.5 backdrop-blur">
                <div className="text-2xl mb-1.5">{f.icon}</div>
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-indigo-200">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-indigo-300">
          © 2026 SavoirVivant · Fait avec passion en France 🇫🇷
        </p>
      </div>

      {/* Panel droit : formulaire */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
            <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center
                            bg-white text-gray-900 shadow-sm">
              Connexion
            </div>
            <Link to="/inscription"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center
                         text-gray-500 hover:text-gray-700">
              Inscription
            </Link>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-gray-900">Bon retour 👋</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connectez-vous à votre espace SavoirVivant
            </p>
          </div>

          {apiError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200
                            text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span>{apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail}
              error={errors.email} placeholder="votre@email.fr" autoComplete="email" />
            <Field label="Mot de passe" type="password" value={password}
              onChange={setPassword} error={errors.password}
              placeholder="Votre mot de passe" autoComplete="current-password" />

            <div className="text-right">
              <Link to="/mot-de-passe-oublie"
                className="text-xs text-indigo-500 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-indigo-500 text-white font-bold rounded-xl
                         hover:bg-indigo-600 disabled:opacity-50 transition-colors text-sm
                         flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                   rounded-full animate-spin" />
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="text-indigo-500 font-semibold hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}