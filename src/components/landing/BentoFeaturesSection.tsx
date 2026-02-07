import { motion } from "framer-motion";
import { Globe, Zap, Scale, Mic } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multilingual",
    description: "Speak in English, Arabic, Spanish, or any language. Get flawless French output every time.",
    span: "md:col-span-2",
    gradient: "linear-gradient(135deg, hsl(290 60% 85%), hsl(260 50% 75%))",
  },
  {
    icon: Zap,
    title: "Instant Drafts",
    description: "Letters, emails, and formal documents generated in seconds — not hours.",
    span: "md:col-span-1",
    gradient: "linear-gradient(135deg, hsl(36 90% 65%), hsl(25 80% 55%))",
  },
  {
    icon: Scale,
    title: "Legal Context",
    description: "Built-in knowledge of French administrative law, procedures, and required formalities.",
    span: "md:col-span-1",
    gradient: "linear-gradient(135deg, hsl(185 70% 50%), hsl(200 60% 40%))",
  },
  {
    icon: Mic,
    title: "Voice-First",
    description: "No typing, no forms. Just speak naturally and let AI handle the rest.",
    span: "md:col-span-2",
    gradient: "linear-gradient(135deg, hsl(16 85% 56%), hsl(0 60% 50%))",
  },
];

const BentoFeaturesSection = () => {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading mb-4 text-foreground">
            Everything you need.{" "}
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 ${f.span}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Colored accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: f.gradient }}
              />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoFeaturesSection;
