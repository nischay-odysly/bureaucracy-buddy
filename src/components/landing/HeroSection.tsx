import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{
            background: "radial-gradient(circle, hsl(239 84% 67% / 0.5), transparent 70%)",
            animation: "orb-float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-1/4 top-1/3 h-[350px] w-[350px] rounded-full opacity-30 blur-[100px]"
          style={{
            background: "radial-gradient(circle, hsl(263 70% 58% / 0.5), transparent 70%)",
            animation: "orb-float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 h-[300px] w-[300px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, hsl(239 84% 67% / 0.4), transparent 70%)",
            animation: "orb-float 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
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
            className="gradient-primary h-12 rounded-xl px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            Try It Free
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="h-12 rounded-xl px-8 text-base text-muted-foreground hover:text-foreground"
          >
            See How It Works
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
