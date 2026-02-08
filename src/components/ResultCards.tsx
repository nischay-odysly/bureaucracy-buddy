import { motion } from "framer-motion";
import { Lightbulb, Mail, Send, MessageCircle, Copy, Check, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProcessedResult } from "@/services/api";
import { playAudio } from "@/services/api";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResultCardsProps {
  result: ProcessedResult;
  onFollowUp: () => void;
  className?: string;
  // Audio sharing from parent
  audioBlob?: Blob | null;
  isAutoPlaying?: boolean;
  onStopAudio?: () => void;
  onPlay?: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const ResultCards = ({
  result,
  onFollowUp,
  className,
  audioBlob: externalAudioBlob,
  isAutoPlaying = false,
  onStopAudio,
  onPlay,
}: ResultCardsProps) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync with external auto-play state
  useEffect(() => {
    if (isAutoPlaying) {
      setIsPlaying(true);
    } else if (!isAutoPlaying && !audioRef.current) {
      // Only turn off if not playing local blob
      setIsPlaying(false);
    }
  }, [isAutoPlaying]);

  const handleCopy = async () => {
    const text = `Subject: ${result.email_draft.subject}\n\n${result.email_draft.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayExplanation = async () => {
    // Stop if already playing
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      onStopAudio?.();
      setIsPlaying(false);
      return;
    }

    // Use cached audio blob if available
    if (externalAudioBlob) {
      setIsPlaying(true);
      const audio = playAudio(externalAudioBlob);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
    } else if (onPlay) {
      // Trigger parent streaming
      onPlay();
    }
  };

  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-4 mb-8", className)}>
      {/* Insight Card */}
      <motion.div
        className="glass-card rounded-2xl p-5"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Lightbulb className="h-4 w-4 text-primary-foreground" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Insight
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handlePlayExplanation}
              disabled={!externalAudioBlob && !isPlaying && !onPlay}
            >
              {isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (externalAudioBlob || onPlay) ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isPlaying ? "Stop" : (externalAudioBlob || onPlay) ? "Listen" : "Loading..."}
            </Button>
          </div>
        </div>
        <p className="text-base leading-relaxed text-foreground">{result.explanation}</p>
      </motion.div>

      {/* Action Card - only show if there's an email draft */}
      {(result.email_draft.subject || result.email_draft.body) && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Mail className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Draft Letter
            </h3>
          </div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Subject: {result.email_draft.subject}
          </p>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {result.email_draft.body}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button className="gradient-primary text-primary-foreground gap-2 rounded-xl">
              <Send className="h-4 w-4" /> Send
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={onFollowUp}
            >
              <MessageCircle className="h-4 w-4" /> Ask Follow-up
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResultCards;
