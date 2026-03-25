import { Link } from 'react-router-dom'
import Logo from '@components/ui/Logo'

const sections = [
  {
    title: '1. Responsable du traitement',
    content: `SavoirVivant est le responsable du traitement de vos données personnelles. Pour toute question relative à la protection de vos données, vous pouvez nous contacter à l'adresse : privacy@savoirvivant.fr`,
  },
  {
    title: '2. Données collectées',
    content: `Nous collectons les données suivantes : informations d'identification (nom, adresse e-mail), données de navigation (pages visitées, durée de session), données de paiement traitées par Stripe (nous ne stockons pas vos coordonnées bancaires), historique d'achats et de lecture, et préférences de compte.`,
  },
  {
    title: '3. Finalités du traitement',
    content: `Vos données sont utilisées pour : la gestion de votre compte et l'accès aux services, le traitement des paiements et la gestion des abonnements, l'envoi d'e-mails transactionnels (confirmation de commande, reçus), l'amélioration de notre plateforme via des statistiques anonymisées, et la communication de mises à jour importantes du service.`,
  },
  {
    title: '4. Base légale',
    content: `Le traitement de vos données repose sur : l'exécution du contrat (gestion de votre compte et des commandes), votre consentement (communications marketing, cookies non essentiels), et notre intérêt légitime (amélioration du service, sécurité).`,
  },
  {
    title: '5. Conservation des données',
    content: `Vos données sont conservées pendant la durée de votre relation contractuelle avec SavoirVivant, et jusqu'à 3 ans après la clôture de votre compte pour les données de facturation (obligation légale). Les données de navigation sont conservées 13 mois maximum.`,
  },
  {
    title: '6. Partage des données',
    content: `Nous ne vendons jamais vos données personnelles. Elles peuvent être partagées avec : Stripe (paiements), AWS (hébergement et stockage), et des prestataires de service e-mail. Ces sous-traitants sont soumis à des obligations contractuelles strictes de confidentialité et de sécurité.`,
  },
  {
    title: '7. Vos droits',
    content: `Conformément au RGPD, vous disposez des droits suivants : accès à vos données, rectification, effacement (droit à l'oubli), portabilité, limitation du traitement, et opposition. Pour exercer ces droits, contactez-nous à privacy@savoirvivant.fr. Vous pouvez également introduire une réclamation auprès de la CNIL.`,
  },
  {
    title: '8. Cookies',
    content: `Nous utilisons des cookies essentiels au fonctionnement du service (session, préférences de thème) et des cookies analytiques anonymisés pour améliorer notre plateforme. Aucun cookie publicitaire n'est utilisé. Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur.`,
  },
  {
    title: '9. Sécurité',
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données : chiffrement HTTPS, hachage des mots de passe avec bcrypt, tokens JWT à durée limitée, et hébergement sur des serveurs AWS certifiés ISO 27001.`,
  },
]

export default function ConfidentialitePage() {
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
                Politique de<br />
                <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>confidentialité</span>
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Dernière mise à jour : <strong style={{ color: 'var(--color-text)' }}>25 mars 2025</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Conforme au : <strong style={{ color: 'var(--color-text)' }}>RGPD</strong>
            </span>
          </div>
        </div>

        {/* Intro */}
        <div style={{ padding: '1.5rem', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L3 5v4c0 3 5 5 5 5s5-2 5-5V5L8 2z" stroke="#10b981" strokeWidth="1.2" fill="rgba(16,185,129,0.1)" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.75, fontWeight: 500 }}>
              La protection de vos données personnelles est une priorité pour SavoirVivant. Cette politique explique quelles données nous collectons, pourquoi, et comment vous pouvez les contrôler.
            </p>
          </div>
        </div>

        {/* Sommaire */}
        <div style={{ marginBottom: '3rem', padding: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Sommaire
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map((s, i) => (
              <a key={i} href={`#conf-${i}`} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s', padding: '2px 0' }}
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
            <div key={i} id={`conf-${i}`} style={{ borderLeft: '2px solid rgba(16,185,129,0.3)', paddingLeft: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                {s.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.8, fontWeight: 400 }}>
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Contact RGPD */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '14px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Exercer vos droits
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65, fontWeight: 400, marginBottom: '0.75rem' }}>
            Pour toute demande relative à vos données personnelles, contactez notre délégué à la protection des données :
          </p>
          <a href="mailto:privacy@savoirvivant.fr" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
            privacy@savoirvivant.fr
          </a>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', fontWeight: 500 }}>© 2025 SavoirVivant</span>
          <Link to="/cgu" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            Conditions générales d'utilisation →
          </Link>
        </div>
      </div>
    </div>
  )
}