import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundDecor from "@/components/BackgroundDecor";
import CallHistoryList from "@/components/CallHistoryList";
import ConversationHistoryList from "@/components/ConversationHistoryList";

const HistoryPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center">
            <BackgroundDecor />

            {/* Header */}
            <div className="z-20 flex w-full items-center justify-between p-4 px-6 md:p-6 max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate("/app")}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to App
                </Button>
            </div>

            <div className="z-10 w-full max-w-4xl px-6 pb-12 flex-1 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">History</h1>
                    <p className="text-muted-foreground mt-2">
                        Review your past conversations and agent calls.
                    </p>
                </div>

                <Tabs defaultValue="conversations" className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="conversations">Conversations</TabsTrigger>
                        <TabsTrigger value="calls">Calls</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversations" className="flex-1">
                        <ConversationHistoryList />
                    </TabsContent>

                    <TabsContent value="calls" className="flex-1">
                        <CallHistoryList />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default HistoryPage;
