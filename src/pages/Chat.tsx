import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatTopBar from "@/components/layout/ChatTopBar";
import ChatWelcome from "@/components/chat/ChatWelcome";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, X } from "lucide-react";

export default function Chat() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const gptId = searchParams.get("gpt");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <ChatSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <ChatTopBar />
        
        {showBanner && (
          <Alert className="rounded-none border-0 bg-emerald-900/20 border-b border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-emerald-100 text-sm">
                We are currently deploying important updates. Please refresh the page regularly to ensure you have the latest version. Thank you for your patience!
              </span>
              <button onClick={() => setShowBanner(false)} className="text-emerald-100 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        {conversationId ? (
          <>
            <ChatMessages conversationId={conversationId} />
            <ChatInput conversationId={conversationId} gptId={gptId || undefined} />
          </>
        ) : (
          <>
            <ChatWelcome />
            <ChatInput conversationId={conversationId} gptId={gptId || undefined} />
          </>
        )}
      </div>
    </div>
  );
}
