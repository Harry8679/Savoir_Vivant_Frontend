import HeroSection from './sections/HeroSection'
import OffresSection from './sections/OffresSection'
import CollectionsSection from './sections/CollectionsSection'
import StatsSection from './sections/StatsSection'
import CtaSection from './sections/CtaSection'

export default function HomePage() {
  return (
    <div style={{ overflowX: 'hidden', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
      <HeroSection />
      <StatsSection />
      <CollectionsSection />
      <OffresSection />
      <CtaSection />
    </div>
  )
}