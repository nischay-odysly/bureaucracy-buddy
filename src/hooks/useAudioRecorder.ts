import { useState, useRef, useCallback } from "react";

export type RecordingState = "idle" | "recording" | "processing";

export function useAudioRecorder() {
  const [state, setState] = useState<RecordingState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setState("recording");
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) return;

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
        setState("processing");
        resolve(blob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const reset = useCallback(() => setState("idle"), []);

  return { state, startRecording, stopRecording, reset };
}
