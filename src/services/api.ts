const API_BASE = "http://localhost:8000/api/v1/agent";

export interface ProcessedResult {
  transcript: string;
  explanation: string;
  email_draft: {
    subject: string;
    body: string;
    recipient: string;
  };
  conversation_id: string;
}

export async function transcribeAndProcess(audioBlob: Blob): Promise<ProcessedResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE}/process-audio`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Text-based chat (no audio)
export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ProcessedResult> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });

  if (!response.ok) {
    throw new Error(`Chat error: ${response.status}`);
  }

  return response.json();
}

export type VoiceType = "english_female" | "english_male" | "french_female" | "french_male";

// Non-streaming TTS (returns full audio)
export async function textToSpeech(text: string, voice: VoiceType = "english_female"): Promise<Blob> {
  const response = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    throw new Error(`TTS error: ${response.status}`);
  }

  return response.blob();
}

// Streaming TTS with real-time playback
export async function textToSpeechStreaming(
  text: string,
  voice: VoiceType = "english_female",
  onChunk?: (progress: number) => void
): Promise<ArrayBuffer> {
  const response = await fetch(`${API_BASE}/tts/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    throw new Error(`TTS stream error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    totalBytes += value.length;
    onChunk?.(totalBytes);
  }

  // Combine all chunks
  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return combined.buffer;
}

// Convert PCM to playable audio (WAV)
export function pcmToWav(pcmData: ArrayBuffer, sampleRate = 24000, channels = 1): Blob {
  const pcm = new DataView(pcmData);
  const numSamples = pcmData.byteLength / 2; // 16-bit samples
  const wavBuffer = new ArrayBuffer(44 + pcmData.byteLength);
  const view = new DataView(wavBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmData.byteLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true); // byte rate
  view.setUint16(32, channels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, pcmData.byteLength, true);

  // Copy PCM data
  const wavData = new Uint8Array(wavBuffer);
  wavData.set(new Uint8Array(pcmData), 44);

  return new Blob([wavBuffer], { type: "audio/wav" });
}

export function playAudio(audioBlob: Blob): HTMLAudioElement {
  const url = URL.createObjectURL(audioBlob);
  const audio = new Audio(url);
  audio.play();

  // Clean up URL after playing
  audio.onended = () => URL.revokeObjectURL(url);

  return audio;
}

// Stream TTS and play immediately, returns audio for replay
export async function streamAndPlayTTS(
  text: string,
  voice: VoiceType = "english_female",
  onProgress?: (bytesReceived: number) => void
): Promise<{ audio: HTMLAudioElement; blob: Blob }> {
  const pcmBuffer = await textToSpeechStreaming(text, voice, onProgress);
  const wavBlob = pcmToWav(pcmBuffer);
  const audio = playAudio(wavBlob);

  return { audio, blob: wavBlob };
}
