import Hero from '../components/Hero';
import QuoteSection from '../components/QuoteSection';
import CtaSection from '../components/CtaSection';
import PopularServers from '../components/PopularServers';
import DualPathSection from '../components/DualPathSection';

export default function Home() {
  return (
    <>
      <Hero />
      <QuoteSection />
      <DualPathSection />
      <PopularServers />
      <CtaSection />
    </>
  );
}
