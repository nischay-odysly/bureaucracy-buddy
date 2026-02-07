import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import MicButton from "@/components/MicButton";
import ResultCards from "@/components/ResultCards";
import BackgroundDecor from "@/components/BackgroundDecor";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeAndProcess, type ProcessedResult } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { state, startRecording, stopRecording, reset } = useAudioRecorder();
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (state === "idle") {
      setResult(null);
      await startRecording();
    } else if (state === "recording") {
      try {
        const blob = await stopRecording();
        const data = await transcribeAndProcess(blob);
        setResult(data);
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not process your request. Make sure the backend is running.",
          variant: "destructive",
        });
      } finally {
        reset();
      }
    }
  };

  const handleFollowUp = () => {
    setResult(null);
    reset();
  };

  const statusText =
    state === "recording"
      ? "Listening..."
      : state === "processing"
      ? "Thinking..."
      : "Tell me what admin task you need help with...";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <BackgroundDecor />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        {/* Logo */}
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin<span className="gradient-text">Hero</span>
          </h1>
        </motion.div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={statusText}
            className="mb-10 text-center text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {statusText}
          </motion.p>
        </AnimatePresence>

        {/* Mic */}
        <MicButton state={state} onToggle={handleToggle} />

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ResultCards result={result} onFollowUp={handleFollowUp} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
