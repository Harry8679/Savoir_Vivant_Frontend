const collections = [
  {
    name: 'Mathématiques Vivantes',
    description: 'Suites, limites, intégrales, probabilités — du lycée aux classes prépa. Chaque concept expliqué avec des exercices en Python et JS.',
    books: 4,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.06)',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'Physique & Chimie Vivants',
    description: 'Mécanique, thermodynamique, électronique. Des livres qui font le pont entre la théorie et la simulation numérique.',
    books: 3,
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.06)',
    border: 'rgba(13,148,136,0.2)',
  },
  {
    name: 'Informatique Vivante',
    description: 'Algorithmique, structures de données, systèmes. Écrits pour les développeurs qui veulent comprendre les fondements.',
    books: 2,
    color: '#d97706',
    bg: 'rgba(217,119,6,0.06)',
    border: 'rgba(217,119,6,0.2)',
    soon: true,
  },
  {
    name: 'Langues Vivantes',
    description: 'Anglais, espagnol, grammaire et vocabulaire — des livres pensés pour progresser vite, avec des exercices contextualisés et des méthodes modernes.',
    books: 0,
    color: '#db2777',
    bg: 'rgba(219,39,119,0.06)',
    border: 'rgba(219,39,119,0.2)',
    soon: true,
  },
]

export default function CollectionsSection() {
  return (
    <section style={{ padding: '7rem 0' }}>
      <div style={{ marginBottom: '4rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500, marginBottom: '1rem' }}>
          Collections
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Des livres organisés<br />
          <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>par univers de connaissance</span>
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {collections.map((col) => (
          <div
            key={col.name}
            style={{
              background: col.bg,
              border: `1px solid ${col.border}`,
              borderRadius: '16px',
              padding: '2rem',
              position: 'relative',
              transition: 'transform 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {col.soon && (
              <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontSize: '0.65rem', padding: '3px 8px',
                background: `rgba(${col.color === '#d97706' ? '217,119,6' : '219,39,119'},0.15)`,
                color: col.color, borderRadius: '100px', fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Bientôt
              </span>
            )}
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: col.color, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 5h12M4 8h8M4 11h10M4 14h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--color-text)' }}>
              {col.name}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              {col.description}
            </p>
            <div style={{ fontSize: '0.75rem', color: col.color, fontWeight: 500 }}>
              {col.books > 0 ? `${col.books} livres disponibles` : 'À venir'}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}