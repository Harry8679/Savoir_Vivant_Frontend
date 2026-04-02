// ─── ProfilePage.tsx ────────────────────────────────────────────────────────
// Chemin : src/pages/Profile/ProfilePage.tsx

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName:       user?.firstName       ?? '',
    lastName:        user?.lastName        ?? '',
    currentPassword: '',
    newPassword:     '',
  })
  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isAuthenticated || !user) {
    navigate('/connexion')
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // await userService.updateProfile(form)
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400
                        to-violet-500 flex items-center justify-center text-white
                        text-2xl font-extrabold flex-shrink-0">
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Membre depuis{' '}
            {new Date(user.createdAt).toLocaleDateString('fr-FR', {
              month: 'long', year: 'numeric',
            })}
          </p>
        </div>
        {user.subscription?.status === 'active' && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-100
                           text-indigo-600 font-bold border border-indigo-200">
            ∞ Abonné
          </span>
        )}
      </div>

      {/* Navigation rapide */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/bibliotheque',  icon: '📚', label: 'Ma bibliothèque' },
          { to: '/commandes',     icon: '📦', label: 'Mes commandes' },
          { to: '/abonnement',    icon: '∞',  label: 'Abonnement' },
          { to: '/parametres/adresses', icon: '📍', label: 'Mes adresses' },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white
                       border border-gray-100 hover:border-indigo-200 hover:shadow-md
                       transition-all text-center">
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
          <div className="grid grid-cols-2 gap-4">
            {[
              { field: 'firstName', label: 'Prénom' },
              { field: 'lastName',  label: 'Nom' },
            ].map(({ field, label }) => (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {label}
                </label>
                <input
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm
                             text-gray-900 focus:outline-none focus:border-indigo-400
                             focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            ))}
          </div>

          {/* Email (non modifiable) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Email
            </label>
            <input value={user.email} disabled
              className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm
                         text-gray-400 bg-gray-50 cursor-not-allowed" />
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
                { field: 'newPassword',     label: 'Nouveau mot de passe', auto: 'new-password' },
              ].map(({ field, label, auto }) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {label}
                  </label>
                  <input type="password" autoComplete={auto}
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

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl
                         text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>

      {/* Zone danger */}
      <div className="mt-6 bg-white rounded-2xl border border-red-100 p-6">
        <h2 className="font-bold text-red-600 text-base mb-2">Zone dangereuse</h2>
        <p className="text-sm text-gray-500 mb-4">
          La déconnexion supprimera votre session sur cet appareil.
        </p>
        <button onClick={handleLogout}
          className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl
                     text-sm hover:bg-red-100 border border-red-200 transition-colors">
          Se déconnecter
        </button>
      </div>
    </div>
  )
}