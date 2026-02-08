import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* Warm gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 right-0 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsl(270 60% 58% / 0.6), transparent 70%)",
            animation: "orb-float 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full opacity-25 blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsl(16 85% 56% / 0.5), transparent 70%)",
            animation: "orb-float 12s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img src={logoFull} alt="Bureaucracy Buddy" className="h-12 md:h-14" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="hero-heading mb-6 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Navigate French Bureaucracy.{" "}
          <span className="gradient-text">In Any Language.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your AI copilot that understands what you need, drafts the perfect
          response in French, and gets your paperwork done — instantly.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/app")}
            className="gradient-primary h-12 rounded-full px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            Try It Free
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 rounded-full px-8 text-base text-muted-foreground hover:text-foreground"
            onClick={scrollToHowItWorks}
          >
            See How It Works
          </Button>
        </motion.div>
      </div>

      {/* Colorful bento preview grid */}
      <motion.div
        className="relative z-10 mx-auto mt-20 grid max-w-4xl grid-cols-4 grid-rows-2 gap-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="col-span-1 row-span-2 aspect-[3/4] rounded-2xl" style={{ background: "hsl(240 5% 90%)" }} />
        <div className="col-span-1 row-span-2 aspect-[3/4] rounded-2xl" style={{ background: "hsl(290 60% 85%)" }} />
        <div className="col-span-1 row-span-2 aspect-[3/4] rounded-2xl" style={{ background: "hsl(36 90% 65%)" }} />
        <div className="col-span-1 row-span-1 rounded-2xl" style={{ background: "linear-gradient(135deg, hsl(185 70% 50%), hsl(210 60% 40%))" }} />
        <div className="col-span-1 row-span-1 rounded-2xl" style={{ background: "linear-gradient(135deg, hsl(260 60% 50%), hsl(290 50% 40%))" }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
