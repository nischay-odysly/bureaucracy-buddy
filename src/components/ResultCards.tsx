import { motion } from "framer-motion";
import { Lightbulb, Mail, Send, MessageCircle, Copy, Check, Volume2, VolumeX, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProcessedResult } from "@/services/api";
import { textToSpeech, playAudio } from "@/services/api";
import { useState, useRef } from "react";

interface ResultCardsProps {
  result: ProcessedResult;
  onFollowUp: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const ResultCards = ({ result, onFollowUp }: ResultCardsProps) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCopy = async () => {
    const text = `Subject: ${result.email_draft.subject}\n\n${result.email_draft.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayExplanation = async () => {
    // Stop if already playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    // Replay from cached audio
    if (audioBlob) {
      setIsPlaying(true);
      const audio = playAudio(audioBlob);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
      return;
    }

    // Fetch new audio (non-streaming WAV for correct playback)
    try {
      setIsLoading(true);

      const blob = await textToSpeech(result.explanation, "english_female");
      setAudioBlob(blob);

      setIsLoading(false);
      setIsPlaying(true);

      const audio = playAudio(blob);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error("TTS failed:", error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-6">
      {/* Insight Card */}
      <motion.div
        className="glass-card rounded-2xl p-6"
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
            {audioBlob && !isPlaying && (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handlePlayExplanation}
              >
                <RotateCcw className="h-4 w-4" />
                Replay
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handlePlayExplanation}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              {isLoading ? "Loading..." : isPlaying ? "Stop" : "Listen"}
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
