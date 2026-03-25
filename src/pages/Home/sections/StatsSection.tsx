const stats = [
  { value: '12+', label: 'Livres disponibles' },
  { value: '3', label: 'Collections actives' },
  { value: '∞', label: 'Accès avec abonnement' },
  { value: 'Web + Mobile', label: 'Lecture partout' },
]

export default function StatsSection() {
  return (
    <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)', padding: '3rem 0' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-text)', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}