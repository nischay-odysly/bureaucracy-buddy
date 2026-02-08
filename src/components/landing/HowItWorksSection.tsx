import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, FileText, Phone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const scenarios = [
  {
    id: "letter",
    icon: FileText,
    userMessage: "I need to renew my titre de séjour",
    outputType: "document" as const,
    outputTitle: "Generated Letter",
    outputContent: [
      "Objet : Demande de renouvellement de titre de séjour",
      "",
      "Madame, Monsieur,",
      "",
      "Par la présente, j'ai l'honneur de solliciter le renouvellement de mon titre de séjour, arrivant à expiration le 15 mars 2026.",
      "",
      "Veuillez trouver ci-joint l'ensemble des pièces justificatives requises à l'appui de ma demande.",
      "",
      "Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    ],
  },
  {
    id: "caf",
    icon: Phone,
    userMessage: "I need to call CAF and check my application status",
    outputType: "call" as const,
    outputTitle: "CAF Call Complete",
    outputContent: [
      "✓ Connected to CAF Île-de-France",
      "✓ Identity verified",
      "",
      "Application Status: Approved",
      "Next payment: March 5, 2026",
      "Amount: €387.00",
      "",
      "No further action required.",
    ],
  },
  {
    id: "coming-soon",
    icon: Sparkles,
    userMessage: "",
    outputType: "coming-soon" as const,
    outputTitle: "More automations coming soon",
    outputContent: [
      "Tax declaration assistance",
      "Filling forms for you",
    ],
  },
];

const CYCLE_MS = 5000;

const HowItWorksSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % scenarios.length);
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, []);

  const scenario = scenarios[activeIndex];

  return (
    <section id="how-it-works" className="px-6 py-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="hero-heading mb-4 text-foreground">
            See how it works
          </h2>
          <p className="text-lg text-muted-foreground">
            From request to resolution in seconds.
          </p>
        </motion.div>

        {/* Scenario indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveIndex(i)}
              className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-all duration-300 ${
                i === activeIndex
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">
                {i === 0 ? "Letter" : i === 1 ? "Phone Call" : "Coming Soon"}
              </span>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mx-auto mb-10 flex max-w-xs gap-1.5">
          {scenarios.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full bg-primary/60"
                initial={{ width: "0%" }}
                animate={{
                  width: i === activeIndex ? "100%" : i < activeIndex ? "100%" : "0%",
                }}
                transition={{
                  duration: i === activeIndex ? CYCLE_MS / 1000 : 0.3,
                  ease: "linear",
                }}
              />
            </div>
          ))}
        </div>

        {/* Demo container */}
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              {scenario.outputType === "coming-soon" ? (
                <ComingSoonCard scenario={scenario} />
              ) : (
                <DemoCard scenario={scenario} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

/* ---- Sub-components ---- */

function DemoCard({ scenario }: { scenario: (typeof scenarios)[0] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* User message */}
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Mic className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="mb-0.5 text-xs font-medium text-muted-foreground">You said</p>
            <p className="text-sm leading-relaxed text-foreground">
              "{scenario.userMessage}"
            </p>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="px-6 py-5">
        <div className="mb-3 flex items-center gap-2">
          <scenario.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {scenario.outputTitle}
          </span>
        </div>

        <div
          className={`rounded-lg p-4 ${
            scenario.outputType === "document"
              ? "bg-muted/50 font-mono text-xs"
              : "bg-muted/50 text-sm"
          }`}
        >
          {scenario.outputContent.map((line, i) => (
            <p
              key={i}
              className={`leading-relaxed text-foreground/80 ${
                line === "" ? "h-3" : ""
              } ${
                scenario.outputType === "call" && line.startsWith("✓")
                  ? "text-primary"
                  : ""
              } ${
                scenario.outputType === "call" &&
                (line.startsWith("Application") ||
                  line.startsWith("Next payment") ||
                  line.startsWith("Amount"))
                  ? "font-medium text-foreground"
                  : ""
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ scenario }: { scenario: (typeof scenarios)[0] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-6 py-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <span className="text-sm font-medium text-muted-foreground">
            {scenario.outputTitle}
          </span>
        </div>

        <div className="space-y-3">
          {scenario.outputContent.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{item}</span>
              <Badge
                variant="secondary"
                className="shrink-0 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Soon
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorksSection;
