import { useState, useRef, useEffect } from "react";
import { useCallSession, TranscriptEntry } from "@/hooks/useCallSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Phone,
    PhoneOff,
    Send,
    Loader2,
    Volume2,
    User,
    Building,
} from "lucide-react";

interface LiveCallUIProps {
    onClose?: () => void;
    /** Call ID from agent - if provided, auto-joins the call */
    agentCallId?: string;
    /** Target hotline for agent-initiated call */
    agentTarget?: string;
}

export default function LiveCallUI({ onClose, agentCallId, agentTarget }: LiveCallUIProps) {
    const {
        callId,
        phase,
        target,
        transcript,
        waitingForUser,
        error,
        agentThinking,
        agentSuggestion,
        startCall,
        joinCall,
        sendResponse,
        hangup,
    } = useCallSession();

    const [userInput, setUserInput] = useState("");
    const [question, setQuestion] = useState("");
    const transcriptRef = useRef<HTMLDivElement>(null);

    // Auto-join if agent initiated the call
    useEffect(() => {
        if (agentCallId && !callId) {

            joinCall(agentCallId, agentTarget || "caf");
        }
    }, [agentCallId, callId, agentTarget, joinCall]);

    // Auto-scroll transcript
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcript]);

    // Handle starting the call (manual mode)
    const handleStartCall = () => {
        if (question.trim()) {
            startCall("caf", question);
        }
    };

    // Handle sending response
    const handleSendResponse = () => {
        if (userInput.trim()) {
            sendResponse(userInput);
            setUserInput("");
        }
    };

    // Phase-based status
    const getStatusText = () => {
        switch (phase) {
            case "gathering_info":
                return "Enter your question";
            case "ready_to_call":
                return "Ready to call";
            case "dialing":
                return "Calling CAF...";
            case "connected":
                return "Connected";
            case "caf_speaking":
                return "CAF is speaking...";
            case "waiting_user":
                return "Your turn to respond";
            case "user_speaking":
                return "Speaking to CAF...";
            case "ended":
                return "Call ended";
            case "failed":
                return "Call failed";
            default:
                return phase;
        }
    };

    const isCallActive = [
        "dialing",
        "connected",
        "caf_speaking",
        "waiting_user",
        "user_speaking",
    ].includes(phase);

    return (
        <div className="flex flex-col h-full max-h-[600px] bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-3 h-3 rounded-full ${isCallActive
                            ? "bg-green-500 animate-pulse"
                            : phase === "ended"
                                ? "bg-gray-500"
                                : "bg-yellow-500"
                            }`}
                    />
                    <div>
                        <h3 className="text-white font-semibold">
                            {isCallActive ? "Live Call" : "Call CAF"}
                        </h3>
                        <p className="text-sm text-gray-400">{getStatusText()}</p>
                    </div>
                </div>

                {isCallActive && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={hangup}
                        className="gap-2"
                    >
                        <PhoneOff className="w-4 h-4" />
                        Hang Up
                    </Button>
                )}
            </div>

            {/* Pre-call input */}
            {phase === "gathering_info" && (
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">
                        What would you like to ask CAF? I'll call them on your behalf.
                    </p>
                    <textarea
                        className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., I want to know the status of my APL application..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <Button
                        onClick={handleStartCall}
                        disabled={!question.trim()}
                        className="w-full gap-2"
                    >
                        <Phone className="w-4 h-4" />
                        Start Call
                    </Button>
                </div>
            )}

            {/* Transcript */}
            {(isCallActive || phase === "ended") && (
                <>
                    <div
                        ref={transcriptRef}
                        className="flex-1 p-4 space-y-4 overflow-y-auto"
                    >
                        {transcript.length === 0 && phase === "dialing" && (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                Connecting to CAF...
                            </div>
                        )}

                        {transcript.map((entry, idx) => (
                            <TranscriptBubble key={idx} entry={entry} />
                        ))}

                        {phase === "caf_speaking" && (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <Volume2 className="w-4 h-4 animate-pulse" />
                                CAF is speaking...
                            </div>
                        )}

                        {/* Agent thinking indicator */}
                        {agentThinking && (
                            <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-900/20 p-3 rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Agent is crafting a response...
                            </div>
                        )}

                        {/* Agent suggestion indicator */}
                        {agentSuggestion && phase === "user_speaking" && (
                            <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg">
                                <User className="w-4 h-4" />
                                Speaking: "{agentSuggestion}"
                            </div>
                        )}
                    </div>

                    {/* User input (when waiting) */}
                    {waitingForUser && (
                        <div className="p-4 border-t border-gray-800 bg-gray-950">
                            <div className="flex gap-2">
                                <Input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendResponse();
                                        }
                                    }}
                                />
                                <Button onClick={handleSendResponse} disabled={!userInput.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Error state */}
            {error && (
                <div className="p-4 bg-red-900/50 border-t border-red-800">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {/* Call ended summary */}
            {phase === "ended" && (
                <div className="p-4 border-t border-gray-800 bg-gray-950">
                    <Button onClick={onClose} className="w-full">
                        Close
                    </Button>
                </div>
            )}
        </div>
    );
}

/**
 * Individual transcript bubble
 */
function TranscriptBubble({ entry }: { entry: TranscriptEntry }) {
    const isUser = entry.speaker === "user";

    return (
        <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-blue-600" : "bg-orange-600"
                    }`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Building className="w-4 h-4 text-white" />
                )}
            </div>

            <div
                className={`max-w-[80%] ${isUser ? "text-right" : ""}`}
            >
                <div
                    className={`inline-block p-3 rounded-lg ${isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white"
                        }`}
                >
                    <p className="text-sm">{entry.english}</p>
                </div>
                {entry.french && !isUser && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                        {entry.french}
                    </p>
                )}
            </div>
        </div>
    );
}
