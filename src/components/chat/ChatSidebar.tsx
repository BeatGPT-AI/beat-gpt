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
        } fixed md:relative md:translate-x-0 transition-transform duration-200 z-40 w-64 h-full bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col`}
      >
        <div className="p-4 border-b border-[#2a2a2a]">
          <Button
            onClick={() => navigate("/gpts")}
            variant="ghost"
            className="w-full justify-start mb-4 hover:bg-[#1a1a1a]"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            GPTs
          </Button>
          <Button onClick={handleNewChat} className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a]" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="mb-4 px-3">
            <input 
              type="text" 
              placeholder="Search chats" 
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="px-2 mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Chats</p>
          </div>
          
          <div className="space-y-2">
            {conversations?.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className="p-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#3a3a3a] cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm text-foreground">{conversation.title}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-[#2a2a2a] mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Gianni Clauw</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-yellow-500">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
