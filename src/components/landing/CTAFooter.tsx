import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";

const CTAFooter = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="px-6 py-32">
        <motion.div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-4 text-foreground">
            Ready to simplify your admin?
          </h2>
          <p className="mb-8 text-base text-muted-foreground">
            Stop struggling. Start speaking.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/app")}
            className="h-12 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90"
          >
            Get Started — It's Free
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="Bureaucracy Buddy" className="h-6 w-6 rounded-md" />
            <span className="text-sm font-medium text-foreground">Bureaucracy Buddy</span>
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bureaucracy Buddy
          </p>
        </div>
      </footer>
    </>
  );
};

export default CTAFooter;
