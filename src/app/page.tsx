import Hero from '@/components/Hero';
import FeatureSequence from '@/components/FeatureSequence';
import BentoAccordion from '@/components/BentoAccordion';
import PricingEngine from '@/components/PricingEngine';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeatureSequence />
      <BentoAccordion />
      <PricingEngine />
      <footer className="bg-oceanic text-mystic py-16 px-4 border-t border-nocturnal">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-mono text-2xl font-bold text-arctic">
            AI<span className="text-forsythia">Platform</span>
          </div>
          <p className="text-sm opacity-60">
            &copy; {new Date().getFullYear()} AI Platform Inc. All logic gates reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
