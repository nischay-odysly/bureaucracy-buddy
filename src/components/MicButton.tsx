import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { RecordingState } from "@/hooks/useAudioRecorder";

interface MicButtonProps {
  state: RecordingState;
  onToggle: () => void;
}

const MicButton = ({ state, onToggle }: MicButtonProps) => {
  const isIdle = state === "idle";
  const isRecording = state === "recording";
  const isProcessing = state === "processing";

  return (
    <div className="relative flex items-center justify-center">
      {/* Ripple rings for recording */}
      {isRecording && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-destructive/30"
              initial={{ width: 80, height: 80, opacity: 0.6 }}
              animate={{ width: 180 + i * 40, height: 180 + i * 40, opacity: 0 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Pulse ring for idle */}
      {isIdle && (
        <motion.div
          className="absolute rounded-full gradient-primary"
          initial={{ width: 88, height: 88, opacity: 0.3 }}
          animate={{ width: 110, height: 110, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.button
        onClick={onToggle}
        disabled={isProcessing}
        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-ring ${
          isRecording
            ? "bg-destructive"
            : "gradient-primary"
        }`}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        animate={isProcessing ? { rotate: 360 } : {}}
        transition={isProcessing ? { duration: 1.2, repeat: Infinity, ease: "linear" } : { type: "spring", stiffness: 300 }}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 text-primary-foreground animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-8 w-8 text-destructive-foreground" />
        ) : (
          <Mic className="h-8 w-8 text-primary-foreground" />
        )}
      </motion.button>
    </div>
  );
};

export default MicButton;
