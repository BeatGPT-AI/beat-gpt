import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  conversationId?: string;
  gptId?: string;
}

export default function ChatInput({ conversationId, gptId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ convId, content, role }: { convId: string; content: string; role: string }) => {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({ conversation_id: convId, content, role })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const streamChat = async (messages: Array<{ role: string; content: string }>, convId: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, gptId }),
    });

    if (!resp.ok || !resp.body) {
      if (resp.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (resp.status === 402) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      }
      throw new Error("Failed to start stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantMessage = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantMessage += content;
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Save assistant message
    if (assistantMessage) {
      await sendMessageMutation.mutateAsync({
        convId,
        content: assistantMessage,
        role: "assistant",
      });
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    const messageText = message;
    setMessage("");

    try {
      let convId = conversationId;

      // Create new conversation if needed
      if (!convId) {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error("Not authenticated");

        const { data: conv, error: convError } = await supabase
          .from("chat_conversations")
          .insert({
            user_id: user.user.id,
            title: messageText.slice(0, 50),
            gpt_id: gptId || null,
          })
          .select()
          .single();

        if (convError) throw convError;
        convId = conv.id;
        navigate(`/chat/${convId}`);
      }

      // Save user message
      await sendMessageMutation.mutateAsync({
        convId,
        content: messageText,
        role: "user",
      });

      // Get all messages for context
      const { data: allMessages } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at");

      const messages = allMessages?.map((m) => ({
        role: m.role,
        content: m.content,
      })) || [];

      // Stream AI response
      await streamChat(messages, convId);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border p-4 bg-card">
      <div className="max-w-3xl mx-auto flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message BeatGPT..."
          className="min-h-[60px] resize-none bg-background"
          disabled={isLoading}
        />
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" disabled={isLoading}>
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
