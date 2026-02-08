import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Calendar, User, Building, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface TranscriptEntry {
    speaker: string;
    french_text: string;
    english_text: string;
    timestamp: string;
}

interface CallSession {
    call_id: string;
    target: string;
    created_at: string;
    transcript: TranscriptEntry[];
}

const CallHistoryList = () => {
    const [calls, setCalls] = useState<CallSession[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/history/");
            if (!res.ok) {
                // If 404, it might mean no history or endpoint issue. Treat as empty for now to avoid scary errors if just empty.
                if (res.status === 404) {
                    setCalls([]);
                    return;
                }
                throw new Error(`Failed to fetch: ${res.status}`);
            }
            const data = await res.json();
            setCalls(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch history:", error);
            toast({
                title: "Error",
                description: "Failed to load call history",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (callId: string) => {
        try {
            const res = await fetch(`http://localhost:8000/api/v1/history/${callId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");

            setCalls(calls.filter((c) => c.call_id !== callId));
            toast({
                title: "Success",
                description: "Call deleted from history",
            });
        } catch (error) {
            console.error("Failed to delete call:", error);
            toast({
                title: "Error",
                description: "Failed to delete call",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading history...
            </div>
        );
    }

    if (calls.length === 0) {
        return (
            <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="pt-6 text-center text-muted-foreground py-12">
                    No calls recorded yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            {calls.map((call) => (
                <Card key={call.call_id} className="overflow-hidden border-0 shadow-md bg-white/80 backdrop-blur-md">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant={call.target === "caf" ? "default" : "secondary"} className="uppercase px-3 py-1">
                                    {call.target}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(call.created_at), "PPP 'at' p", { locale: fr })}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(call.call_id)}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete call"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ScrollArea className="h-[250px] w-full rounded-md border bg-white/50 p-4">
                            <div className="space-y-4">
                                {call.transcript.map((entry, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex gap-3 ${entry.speaker === "user" ? "flex-row-reverse" : ""
                                            }`}
                                    >
                                        <div
                                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${entry.speaker === "user" ? "bg-blue-600" : "bg-orange-600"
                                                }`}
                                        >
                                            {entry.speaker === "user" ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Building className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        <div className={`flex flex-col max-w-[80%] ${entry.speaker === "user" ? "items-end" : "items-start"}`}>
                                            <div
                                                className={`rounded-lg px-4 py-2 text-sm ${entry.speaker === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-900"
                                                    }`}
                                            >
                                                <p className="font-medium">{entry.english_text}</p>
                                            </div>
                                            {entry.french_text && (
                                                <p className={`text-xs mt-1 italic ${entry.speaker === "user" ? "text-right text-muted-foreground" : "text-gray-500"}`}>
                                                    {entry.french_text}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {call.transcript.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic text-center">No transcript available.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CallHistoryList;
