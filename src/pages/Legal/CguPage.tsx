import { Link } from 'react-router-dom'
import Logo from '@components/ui/Logo'

const sections = [
  {
    title: '1. Objet',
    content: `Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme SavoirVivant, accessible via le site web et l'application mobile. En accédant à la plateforme, vous acceptez sans réserve les présentes CGU.`,
  },
  {
    title: '2. Description du service',
    content: `SavoirVivant est une plateforme de livres pédagogiques numériques et physiques couvrant les mathématiques, la physique, l'informatique et les langues. Trois modes d'accès sont proposés : l'achat de livres papier avec livraison, l'achat de livres numériques avec accès illimité, et l'abonnement mensuel ou annuel donnant accès à l'ensemble de la bibliothèque numérique.`,
  },
  {
    title: '3. Inscription et compte utilisateur',
    content: `Pour accéder aux fonctionnalités de la plateforme, vous devez créer un compte en fournissant une adresse e-mail valide et un mot de passe sécurisé. Vous êtes responsable de la confidentialité de vos identifiants. Toute utilisation de votre compte sous votre responsabilité. SavoirVivant se réserve le droit de suspendre tout compte en cas d'utilisation frauduleuse ou contraire aux présentes CGU.`,
  },
  {
    title: '4. Conditions financières',
    content: `Les prix affichés sont en euros TTC. Les achats sont définitifs et non remboursables, sauf en cas de défaut technique avéré. L'abonnement est renouvelé automatiquement à la fin de chaque période. Vous pouvez annuler votre abonnement à tout moment depuis votre espace profil, avec effet à la fin de la période en cours. Les paiements sont sécurisés via Stripe.`,
  },
  {
    title: '5. Propriété intellectuelle',
    content: `L'ensemble des contenus présents sur la plateforme (textes, illustrations, exercices, code source) est protégé par le droit d'auteur et appartient à SavoirVivant ou à ses partenaires. Toute reproduction, distribution ou utilisation commerciale sans autorisation écrite préalable est strictement interdite.`,
  },
  {
    title: '6. Limitation de responsabilité',
    content: `SavoirVivant s'engage à maintenir la plateforme accessible en permanence mais ne peut garantir une disponibilité ininterrompue. En cas d'interruption de service planifiée ou imprévue, aucune indemnisation ne sera due. La plateforme décline toute responsabilité pour tout dommage indirect résultant de l'utilisation ou de l'impossibilité d'utiliser le service.`,
  },
  {
    title: '7. Modification des CGU',
    content: `SavoirVivant se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par e-mail de toute modification substantielle. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles conditions.`,
  },
  {
    title: '8. Droit applicable',
    content: `Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis à la compétence des tribunaux français.`,
  },
]

export default function CguPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 2rem' }}>

        {/* En-tête */}
        <div style={{ marginBottom: '4rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '3rem', color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Retour à l'accueil
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <Logo size={40} />
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                SavoirVivant
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Conditions générales<br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>d'utilisation</span>
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Dernière mise à jour : <strong style={{ color: 'var(--color-text)' }}>25 mars 2026</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Version : <strong style={{ color: 'var(--color-text)' }}>1.0</strong>
            </span>
          </div>
        </div>

        {/* Intro */}
        <div style={{ padding: '1.5rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '14px', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.75, fontWeight: 500 }}>
            Bienvenue sur SavoirVivant. Ces conditions régissent votre utilisation de notre plateforme. Nous vous invitons à les lire attentivement avant d'utiliser nos services.
          </p>
        </div>

        {/* Sommaire */}
        <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Sommaire
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map((s, i) => (
              <a key={i} href={`#section-${i}`} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', padding: '2px 0' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map((s, i) => (
            <div key={i} id={`section-${i}`} style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                {s.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.8, fontWeight: 400 }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer légal */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>© 2025 SavoirVivant</span>
          <Link to="/confidentialite" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Politique de confidentialité →
          </Link>
        </div>
      </div>
    </div>
  )
}