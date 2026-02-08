import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MicButton from "@/components/MicButton";
import ResultCards from "@/components/ResultCards";
import { UserMessageBubble } from "@/components/UserMessageBubble";
import BackgroundDecor from "@/components/BackgroundDecor";
import LiveCallUI from "@/components/LiveCallUI";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeAndProcess, sendChatMessage, getConversation, type ProcessedResult, type ConversationMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAutoPlayTTS } from "@/hooks/useAutoPlayTTS";
import { ArrowLeft, Send, Keyboard, Mic, Plus, Loader2, Volume2, VolumeX, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; data: ProcessedResult; audioBlob?: Blob | null };

const AppPage = () => {
  const { state, startRecording, stopRecording, reset } = useAudioRecorder();
  const {
    isAutoPlayEnabled,
    toggleAutoPlay,
    play,
    stop,
    isPlaying: isTTSPlaying,
    isLoading: isTTSLoading,
  } = useAutoPlayTTS();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [textInput, setTextInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [agentCallId, setAgentCallId] = useState<string | null>(null);
  const [agentCallTarget, setAgentCallTarget] = useState<string>("caf");

  /**
   * Check if response contains a call action and handle it
   */
  const handleCallAction = (data: ProcessedResult) => {
    if (data.call_action?.call_id) {

      setAgentCallId(data.call_action.call_id);
      setAgentCallTarget(data.call_action.target || "caf");
      setShowCallDialog(true);
    }
  };

  const location = useLocation();

  // Load conversation from history if ID is passed
  useEffect(() => {
    const loadHistory = async () => {
      const historyId = location.state?.conversationId;
      if (historyId) {
        try {
          // Clear previous state first
          setMessages([]);
          setConversationId(historyId);

          const data = await getConversation(historyId);

          if (data.messages && Array.isArray(data.messages)) {
            // Map backend messages to frontend format
            const mappedMessages: Message[] = data.messages.map((msg: ConversationMessage) => {
              if (msg.role === "user") {
                return { role: "user", content: msg.content };
              } else {
                return {
                  role: "assistant",
                  data: {
                    transcript: "", // No transcript for historical assistant messages
                    explanation: msg.content,
                    email_draft: msg.metadata?.email_draft || { subject: "", body: "", recipient: "" },
                    call_action: msg.metadata?.call_action,
                    conversation_id: historyId
                  },
                  audioBlob: null
                };
              }
            });
            setMessages(mappedMessages);
          }
        } catch (error) {
          console.error("Failed to load conversation history:", error);
          toast({
            title: "Error",
            description: "Could not load chat history.",
            variant: "destructive"
          });
        }
      }
    };

    loadHistory();
  }, [location.state, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, state, isSubmitting]);

  // Stop audio when starting new recording
  useEffect(() => {
    if (state === "recording") {
      stop();
      setCurrentPlayingIndex(null);
    }
  }, [state, stop]);

  const handleToggle = async () => {
    if (state === "idle") {
      await startRecording();
    } else if (state === "recording") {
      try {
        const blob = await stopRecording();
        const data = await transcribeAndProcess(blob, conversationId);

        // Add user transcript and bot response
        const newIndex = messages.length + 1; // Index of the new assistant message
        setMessages(prev => [
          ...prev,
          { role: "user", content: data.transcript },
          { role: "assistant", data: data, audioBlob: null }
        ]);

        if (data.conversation_id) setConversationId(data.conversation_id);

        // Check for agent-initiated call
        handleCallAction(data);

        // Auto-play if enabled
        if (isAutoPlayEnabled && data.explanation) {
          setCurrentPlayingIndex(newIndex);
          play(data.explanation);
        }
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

    const currentText = textInput.trim();
    setTextInput("");
    setIsSubmitting(true);

    // Optimistic user message
    setMessages(prev => [...prev, { role: "user", content: currentText }]);

    try {
      const data = await sendChatMessage(currentText, conversationId);
      const newIndex = messages.length + 1; // Index of the new assistant message

      setMessages(prev => [...prev, { role: "assistant", data: data, audioBlob: null }]);

      if (data.conversation_id) setConversationId(data.conversation_id);

      // Check for agent-initiated call
      handleCallAction(data);

      // Auto-play if enabled
      if (isAutoPlayEnabled && data.explanation) {
        setCurrentPlayingIndex(newIndex);
        play(data.explanation);
      }

      setInputMode("text");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Could not process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNewChat = () => {
    setConversationId(undefined);
    setMessages([]);
    setTextInput("");
    setCurrentPlayingIndex(null);
    stop();
    toast({
      title: "New Chat Started",
      description: "Context has been cleared.",
    });
  };

  const handleFollowUp = () => {
    setInputMode("text");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleStopAudio = () => {
    stop();
    setCurrentPlayingIndex(null);
  };

  return (
    <div className="relative flex h-screen flex-col items-center overflow-hidden bg-background">
      <BackgroundDecor />

      {/* Header */}
      <div className="z-20 flex w-full items-center justify-between p-4 px-6 md:p-6">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/app/history")}
          >
            <RotateCcw className="h-4 w-4" />
            History
          </Button>
        </div>

        {conversationId && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}

        {/* Auto-play Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto mr-2 text-muted-foreground hover:text-foreground"
          onClick={toggleAutoPlay}
          title={isAutoPlayEnabled ? "Mute Auto-play" : "Enable Auto-play"}
        >
          {isAutoPlayEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-2xl flex flex-col overflow-y-auto px-4 pb-4 z-10 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center opacity-80 mt-10">
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              What do you need help with?
            </h1>
            <p className="max-w-md text-muted-foreground">
              Ask about visas, taxes, housing, or any French bureaucracy nightmare.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6 pt-4">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <UserMessageBubble text={msg.content} />
              ) : (
                <ResultCards
                  result={msg.data}
                  onFollowUp={handleFollowUp}
                  className="mb-2"
                  audioBlob={msg.audioBlob}
                  isAutoPlaying={currentPlayingIndex === i && isTTSPlaying}
                  onStopAudio={handleStopAudio}
                  onPlay={() => {
                    setCurrentPlayingIndex(i);
                    play(msg.data.explanation);
                  }}
                />
              )}
            </div>
          ))}

          {/* Loading Indicators */}
          {(state === "processing" || isSubmitting) && (
            <div className="glass-card w-fit rounded-2xl rounded-tl-sm p-4 animate-pulse">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="z-20 w-full max-w-2xl px-4 pb-6 pt-2">
        {/* Mode Toggle */}
        <div className="mx-auto mb-4 flex w-fit rounded-full border bg-background/50 p-1 backdrop-blur-sm">
          <Button
            variant={inputMode === "voice" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full gap-2 px-4"
            onClick={() => setInputMode("voice")}
          >
            <Mic className="h-4 w-4" />
            Voice
          </Button>
          <Button
            variant={inputMode === "text" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full gap-2 px-4"
            onClick={() => {
              setInputMode("text");
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          >
            <Keyboard className="h-4 w-4" />
            Text
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 px-4"
            onClick={() => setShowCallDialog(true)}
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>

        {/* Dynamic Input */}
        <div className="min-h-[80px] flex items-end justify-center">
          {inputMode === "voice" ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground mb-2">
                {state === "idle" && "Tap to speak"}
                {state === "recording" && "Listening..."}
                {state === "processing" && "Processing..."}
              </p>
              <MicButton state={state} onToggle={handleToggle} />
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="w-full flex gap-2">
              <Input
                ref={inputRef}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your question..."
                className="bg-background/80 backdrop-blur-sm"
                disabled={isSubmitting}
                autoFocus
              />
              <Button
                type="submit"
                disabled={!textInput.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={(open) => {
        setShowCallDialog(open);
        if (!open) {
          // Reset agent call state when closing
          setAgentCallId(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px] p-0 border-none bg-transparent">
          <LiveCallUI
            onClose={() => {
              setShowCallDialog(false);
              setAgentCallId(null);
            }}
            agentCallId={agentCallId || undefined}
            agentTarget={agentCallTarget}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppPage;
