import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";

export default function Chat() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const gptId = searchParams.get("gpt");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex flex-col">
        <ChatMessages conversationId={conversationId} />
        <ChatInput conversationId={conversationId} gptId={gptId || undefined} />
      </div>
    </div>
  );
}
