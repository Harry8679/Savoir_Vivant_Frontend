// src/pages/Profile/ProfilePage.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  // user.name est le seul champ nom dans ton User type
  // On découpe en prénom / nom sur l'espace (ex: "Harry MacCode" → "Harry" / "MacCode")
  const nameParts  = user?.name?.split(' ') ?? ['', '']
  const firstName  = nameParts[0] ?? ''
  const lastName   = nameParts.slice(1).join(' ') ?? ''
  const initials   = user?.name
    ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  const [form, setForm] = useState({
    name:            user?.name ?? '',
    currentPassword: '',
    newPassword:     '',
  })
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated || !user) {
    navigate('/login')
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // await userService.updateProfile({ name: form.name, ... })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // user.subscriptionStatus : 'active' | 'inactive' | 'cancelled' | 'past_due'
  const isSubscribed = user.subscriptionStatus === 'active'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400
                        to-violet-500 flex items-center justify-center text-white
                        text-2xl font-extrabold flex-shrink-0">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : initials}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.role === 'admin' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100
                             text-violet-700 font-semibold mt-1 inline-block">
              Admin
            </span>
          )}
        </div>

        {isSubscribed && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-100
                           text-indigo-600 font-bold border border-indigo-200">
            ∞ Abonné
          </span>
        )}
      </div>

      {/* Navigation rapide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/library',            icon: '📚', label: 'Ma bibliothèque' },
          { to: '/orders',             icon: '📦', label: 'Mes commandes'   },
          { to: '/subscription',       icon: '∞',  label: 'Abonnement'      },
          { to: '/settings/addresses', icon: '📍', label: 'Mes adresses'    },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white
                       border border-gray-100 hover:border-indigo-200 hover:shadow-md
                       transition-all text-center"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-semibold text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Formulaire profil */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-5">
          Informations personnelles
        </h2>

        <form onSubmit={handleSave} className="space-y-5 max-w-lg">

          {/* Nom complet */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Nom complet
            </label>
            <input
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Harry MacCode"
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm
                         text-gray-900 focus:outline-none focus:border-indigo-400
                         focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Email (non modifiable) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Email
            </label>
            <input
              value={user.email}
              disabled
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm
                         text-gray-400 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400">
              Pour changer votre email, contactez le support.
            </p>
          </div>

          {/* Changement mot de passe */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">
              Changer le mot de passe
            </h3>
            <div className="space-y-3">
              {[
                { field: 'currentPassword', label: 'Mot de passe actuel',  auto: 'current-password' },
                { field: 'newPassword',     label: 'Nouveau mot de passe', auto: 'new-password'     },
              ].map(({ field, label, auto }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type="password"
                    autoComplete={auto}
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm
                               text-gray-900 focus:outline-none focus:border-indigo-400
                               focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200
                            text-sm text-green-600 flex items-center gap-2">
              <span>✓</span> Profil mis à jour avec succès
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl
                       text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Zone danger */}
      <div className="mt-6 bg-white rounded-2xl border border-red-100 p-6">
        <h2 className="font-bold text-red-600 text-base mb-2">Zone dangereuse</h2>
        <p className="text-sm text-gray-500 mb-4">
          La déconnexion supprimera votre session sur cet appareil.
        </p>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl
                     text-sm hover:bg-red-100 border border-red-200 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}