import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CapabilitySection from "@/components/landing/BentoFeaturesSection";
import CTAFooter from "@/components/landing/CTAFooter";

const Index = () => {
  return (
    <main className="relative">
      <HeroSection />
      <HowItWorksSection />
      <CapabilitySection />
      <CTAFooter />
    </main>
  );
};

export default Index;
