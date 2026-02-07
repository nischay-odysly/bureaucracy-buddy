const API_URL = "http://localhost:8000/api/v1/agent/process-audio";

export interface ProcessedResult {
  explanation: string;
  email_draft: {
    subject: string;
    body: string;
  };
}

export async function transcribeAndProcess(audioBlob: Blob): Promise<ProcessedResult> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
