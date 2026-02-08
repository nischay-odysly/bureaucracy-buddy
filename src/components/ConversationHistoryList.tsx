import { useEffect, useState } from "react";
import { format } from "date-fns";
import { MessageSquare, Trash2, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
    conversation_id: string;
    title: string;
    created_at: string; // ISO string
    updated_at: string;
    message_count: number;
}

const ConversationHistoryList = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    const fetchConversations = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/v1/conversations/");
            if (!res.ok) throw new Error("Failed to fetch conversations");
            const data = await res.json();
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            toast({
                title: "Error",
                description: "Could not load conversation history.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card click
        try {
            const res = await fetch(`http://localhost:8000/api/v1/conversations/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete");

            setConversations(prev => prev.filter(c => c.conversation_id !== id));
            toast({
                title: "Deleted",
                description: "Conversation removed from history."
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not delete conversation.",
                variant: "destructive"
            });
        }
    };

    const handleResume = (id: string) => {
        navigate("/app", { state: { conversationId: id } });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading conversations...
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p>No conversations yet.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-4 pb-20">
                {conversations.map((conv) => (
                    <Card
                        key={conv.conversation_id}
                        className="bg-card/50 backdrop-blur-sm border-white/10 hover:bg-card/80 transition-colors cursor-pointer group"
                        onClick={() => handleResume(conv.conversation_id)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base font-medium line-clamp-1">
                                    {conv.title || "Untitled Conversation"}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(conv.updated_at), "PPP")} • {format(new Date(conv.updated_at), "p")}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                                onClick={(e) => handleDelete(e, conv.conversation_id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {conv.message_count} messages
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
};

export default ConversationHistoryList;
