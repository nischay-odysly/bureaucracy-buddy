import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 py-32">
      <div className="flex max-w-3xl flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <img src={logoFull} alt="Bureaucracy Buddy" className="h-10 w-auto" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="hero-heading mb-6 text-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Stop struggling with French bureaucracy.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mb-3 text-xl font-medium text-foreground/80 md:text-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Just speak. Bureaucracy Buddy handles the rest.
        </motion.p>

        {/* Supporting line */}
        <motion.p
          className="mb-12 text-base text-muted-foreground"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          From confusion to resolution in seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/app")}
            className="h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
          >
            Get Started
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <button
            onClick={scrollToHowItWorks}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See how it works
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
