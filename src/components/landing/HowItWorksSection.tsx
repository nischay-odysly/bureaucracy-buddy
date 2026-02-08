import { motion } from "framer-motion";
import { Mic, Lightbulb, Rocket } from "lucide-react";

const steps = [
  {
    icon: Mic,
    step: "01",
    title: "Speak",
    description: "Describe your admin problem in any language — just talk naturally.",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Understand",
    description: "AI analyzes your situation, identifies the right procedure, and explains it clearly.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Act",
    description: "Get a drafted email, a phone call made on your behalf, or step-by-step guidance — whatever it takes to resolve your issue.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-heading mb-4 text-foreground">
            Three steps. Zero stress.
          </h2>
          <p className="text-lg text-muted-foreground">
            From confusion to resolution in under a minute.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Icon circle */}
              <div className="relative z-10 mb-6 flex h-[104px] w-[104px] items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-secondary" />
                <div className="absolute inset-[2px] rounded-full bg-background" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full gradient-primary shadow-lg shadow-primary/20">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              {/* Step number */}
              <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Step {s.step}
              </span>

              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="max-w-[280px] text-sm leading-relaxed text-muted-foreground">
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
