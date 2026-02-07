import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MicButton from "@/components/MicButton";
import ResultCards from "@/components/ResultCards";
import BackgroundDecor from "@/components/BackgroundDecor";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeAndProcess, sendChatMessage, type ProcessedResult } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Keyboard, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AppPage = () => {
  const { state, startRecording, stopRecording, reset } = useAudioRecorder();
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (state === "idle") {
      setResult(null);
      await startRecording();
    } else if (state === "recording") {
      try {
        const blob = await stopRecording();
        const data = await transcribeAndProcess(blob);
        setResult(data);
      } catch {
        toast({
          title: "Something went wrong",
          description: "Could not process your recording. Please try again.",
          variant: "destructive",
        });
      } finally {
        reset();
      }
    }
  };

  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const data = await sendChatMessage(textInput.trim());
      setResult(data);
      setTextInput("");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Could not process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <BackgroundDecor />

      <Button
        variant="ghost"
        className="absolute left-6 top-6 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          What do you need help with?
        </h1>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={inputMode === "voice" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setInputMode("voice")}
          >
            <Mic className="h-4 w-4" />
            Voice
          </Button>
          <Button
            variant={inputMode === "text" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setInputMode("text")}
          >
            <Keyboard className="h-4 w-4" />
            Text
          </Button>
        </div>

        {inputMode === "voice" ? (
          <>
            <p className="mb-10 text-muted-foreground text-center">
              {state === "idle" && "Tap the mic and describe your admin task."}
              {state === "recording" && "Listening… tap again when you're done."}
              {state === "processing" && "Thinking…"}
            </p>
            <MicButton state={state} onToggle={handleToggle} />
          </>
        ) : (
          <>
            <p className="mb-6 text-muted-foreground text-center">
              Type your question about French bureaucracy.
            </p>
            <form onSubmit={handleTextSubmit} className="w-full flex gap-3">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., How do I cancel my apartment lease in Paris?"
                className="flex-1"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                disabled={!textInput.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </form>
          </>
        )}

        {result && (
          <ResultCards result={result} onFollowUp={() => setResult(null)} />
        )}
      </div>
    </div>
  );
};

export default AppPage;
