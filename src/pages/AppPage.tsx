import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MicButton from "@/components/MicButton";
import ResultCards from "@/components/ResultCards";
import BackgroundDecor from "@/components/BackgroundDecor";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeAndProcess, type ProcessedResult } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppPage = () => {
  const { state, startRecording, stopRecording, reset } = useAudioRecorder();
  const [result, setResult] = useState<ProcessedResult | null>(null);
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

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          What do you need help with?
        </h1>
        <p className="mb-10 text-muted-foreground">
          {state === "idle" && "Tap the mic and describe your admin task."}
          {state === "recording" && "Listening… tap again when you're done."}
          {state === "processing" && "Thinking…"}
        </p>

        <MicButton state={state} onToggle={handleToggle} />

        {result && (
          <ResultCards result={result} onFollowUp={() => setResult(null)} />
        )}
      </div>
    </div>
  );
};

export default AppPage;
