import { useState } from 'react'
import DashboardLayout from '@components/layout/DashboardLayout'
import { useAuthStore } from '@store/authStore'
import ThemeToggle from '@components/ui/ThemeToggle'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '' })
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [saved, setSaved] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem',
    background: 'var(--color-surface-2)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px', color: 'var(--color-text)',
    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
    fontWeight: 500, outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <DashboardLayout title="Paramètres" subtitle="Gérez vos informations personnelles et préférences">

      {/* Infos personnelles */}
      <SettingCard title="Informations personnelles" icon="👤">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nom complet</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Adresse e-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ padding: '0.7rem 1.75rem', background: saved ? '#10b981' : 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.3s' }}>
              {saved ? '✓ Sauvegardé !' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </SettingCard>

      {/* Mot de passe */}
      <SettingCard title="Sécurité" icon="🔐">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={e => e.preventDefault()}>
          {[
            { label: 'Mot de passe actuel', key: 'current' as const },
            { label: 'Nouveau mot de passe', key: 'next' as const },
            { label: 'Confirmer le nouveau', key: 'confirm' as const },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw[f.key] ? 'text' : 'password'}
                  value={pwForm[f.key]}
                  onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                  style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button type="button" onClick={() => setShowPw(s => ({ ...s, [f.key]: !s[f.key] }))}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0, display: 'flex' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPw[f.key]
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={{ padding: '0.7rem 1.75rem', background: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-primary)' }}>
              Mettre à jour le mot de passe
            </button>
          </div>
        </form>
      </SettingCard>

      {/* Apparence */}
      <SettingCard title="Apparence" icon="🎨">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '3px' }}>Thème de l'interface</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Basculez entre le mode sombre et clair selon vos préférences de lecture.</div>
          </div>
          <ThemeToggle />
        </div>
      </SettingCard>

      {/* Notifications */}
      <SettingCard title="Notifications" icon="🔔">
        {[
          { label: 'Nouveaux livres', desc: 'Soyez notifié lors de la sortie de nouveaux livres' },
          { label: 'Offres spéciales', desc: 'Recevez les promotions et remises exclusives' },
          { label: 'Rappels de lecture', desc: 'Rappels hebdomadaires pour reprendre votre lecture' },
        ].map((notif, i, arr) => (
          <div key={notif.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: i < arr.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>{notif.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{notif.desc}</div>
            </div>
            <ToggleSwitch defaultOn={i === 0} />
          </div>
        ))}
      </SettingCard>

      {/* Danger zone */}
      <SettingCard title="Zone de danger" icon="⚠️" danger>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444', marginBottom: '3px' }}>Supprimer mon compte</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Toutes vos données seront définitivement supprimées. Cette action est irréversible.</div>
          </div>
          <button style={{ padding: '0.7rem 1.25rem', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}>
            Supprimer mon compte
          </button>
        </div>
      </SettingCard>
    </DashboardLayout>
  )
}

function SettingCard({ title, icon, children, danger }: { title: string; icon: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: `1px solid ${danger ? 'rgba(239,68,68,0.2)' : 'var(--color-border)'}`,
      borderRadius: '16px', marginBottom: '1.25rem', overflow: 'hidden',
    }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--color-surface-2)' }}>
        <span style={{ fontSize: '1rem' }}>{icon}</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: danger ? '#ef4444' : 'var(--color-text)', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ padding: '1.5rem' }}>{children}</div>
    </div>
  )
}

function ToggleSwitch({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false)
  return (
    <button onClick={() => setOn(!on)} style={{ width: '44px', height: '24px', borderRadius: '100px', border: 'none', background: on ? 'var(--color-primary)' : 'var(--color-border)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0, padding: 0 }}>
      <span style={{ position: 'absolute', top: '3px', left: on ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)', display: 'block' }} />
    </button>
  )
}