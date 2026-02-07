import HeroSection from "@/components/landing/HeroSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BentoFeaturesSection from "@/components/landing/BentoFeaturesSection";
import CTAFooter from "@/components/landing/CTAFooter";

const Index = () => {
  return (
    <main className="relative overflow-hidden">
      <HeroSection />
      <PainPointsSection />
      <HowItWorksSection />
      <BentoFeaturesSection />
      <CTAFooter />
    </main>
  );
};

export default Index;
