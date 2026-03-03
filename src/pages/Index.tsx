import { SalaryProvider } from '@/contexts/SalaryContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Calculator from '@/components/Calculator';
import PayslipDecoder from '@/components/PayslipDecoder';
import ShareSection from '@/components/ShareSection';
import FAQ from '@/components/FAQ';
import CTASection from '@/components/CTASection';

const Index = () => {
  return (
    <SalaryProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Calculator />
        <PayslipDecoder />
        <div className="px-4 md:px-6 pb-8">
          <ShareSection />
        </div>
        <FAQ />
        <CTASection />
        <footer className="py-6 px-6 text-center">
          <p className="text-xs text-text-muted max-w-2xl mx-auto">
            Simulation indicative — les montants réels dépendent de votre convention collective, mutuelle et situation personnelle. Taux URSSAF et AGIRC-ARRCO 2025.
          </p>
        </footer>
      </div>
    </SalaryProvider>
  );
};

export default Index;
