import { motion } from "framer-motion";
import { FileText, Globe, Clock } from "lucide-react";

const painPoints = [
  {
    icon: FileText,
    title: "Complex Forms",
    description: "Navigating CERFA forms and administrative requirements shouldn't require a law degree.",
  },
  {
    icon: Globe,
    title: "Language Barriers",
    description: "Official correspondence in French is intimidating when it's not your first language.",
  },
  {
    icon: Clock,
    title: "Endless Wait Times",
    description: "Hours spent on hold, weeks waiting for responses — bureaucracy moves at its own pace.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const PainPointsSection = () => {
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
            Admin shouldn't be this hard.
          </h2>
          <p className="text-lg text-muted-foreground">
            We get it. French paperwork is a maze.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {painPoints.map((point) => (
            <motion.div
              key={point.title}
              variants={item}
              className="bento-card flex flex-col items-start"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <point.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;
