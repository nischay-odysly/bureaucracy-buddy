import { motion } from "framer-motion";
import { Globe, Zap, Scale, Mic } from "lucide-react";

const capabilities = [
  { icon: Globe, label: "Multilingual" },
  { icon: Zap, label: "Instant Drafts" },
  { icon: Scale, label: "Legal Context" },
  { icon: Mic, label: "Voice-First" },
];

const CapabilitySection = () => {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          className="section-heading mb-6 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Voice-first AI that turns speech into action.
        </motion.h2>

        <motion.p
          className="mx-auto mb-16 max-w-xl text-base leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Speak in any language. Get perfectly formatted French administrative
          documents, phone calls made on your behalf, and step-by-step guidance
          — all grounded in French legal context.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {capabilities.map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 text-muted-foreground">
              <c.icon className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm font-medium">{c.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CapabilitySection;
