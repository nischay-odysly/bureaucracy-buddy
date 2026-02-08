import { motion } from "framer-motion";
import { Mic, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Speak",
    description: "Describe your problem in any language.",
  },
  {
    icon: Lightbulb,
    title: "Understand",
    description: "AI identifies the right procedure instantly.",
  },
  {
    icon: Rocket,
    title: "Act",
    description: "Get a drafted email, phone call, or step-by-step guidance.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.p
          className="mb-16 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          How it works
        </motion.p>

        <div className="relative grid gap-16 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-3 hidden h-px bg-border md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="relative z-10 mb-6 flex h-6 w-6 items-center justify-center">
                <s.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
