import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTAFooter = () => {
  return (
    <>
      <section className="relative px-6 py-32">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[400px] w-[600px] rounded-full opacity-15 blur-[120px]"
            style={{
              background: "radial-gradient(circle, hsl(16 85% 56% / 0.6), transparent 70%)",
            }}
          />
        </div>

        <motion.div
          className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-4 text-foreground">
            Ready to simplify your admin?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Stop struggling with French bureaucracy. Start speaking, and let AdminHero handle the rest.
          </p>
          <Button
            size="lg"
            className="gradient-primary h-12 rounded-full px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            Get Started — It's Free
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
            <span className="text-sm font-semibold text-foreground">AdminHero</span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AdminHero. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
