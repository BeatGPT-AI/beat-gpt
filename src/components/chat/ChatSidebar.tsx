import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Settings, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatSidebar({ isOpen, onToggle }: ChatSidebarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/");
  };

  const handleNewChat = () => {
    navigate("/chat");
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 transition-transform duration-200 z-40 w-64 h-full bg-secondary border-r border-border flex flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">BeatGPT</span>
          </div>
          <Button onClick={handleNewChat} className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {conversations?.map((conversation) => (
              <Button
                key={conversation.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => navigate(`/chat/${conversation.id}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{conversation.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
