import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, User, CreditCard, MessageCircle, Settings, HelpCircle, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

export default function UserMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary">
            {profile?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-[#1a1a1a] border-[#2a2a2a]">
        <div className="px-3 py-3 border-b border-[#2a2a2a]">
          <p className="text-sm font-medium text-foreground">{profile?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Crown className="h-3 w-3 text-yellow-500" />
            <span className="text-xs text-yellow-500">Premium</span>
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            navigate("/admin");
          }}
          className="cursor-pointer py-3 hover:bg-[#2a2a2a]"
        >
          <Shield className="mr-3 h-4 w-4" />
          Admin Panel
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            navigate("/subscription");
          }}
          className="cursor-pointer py-3 hover:bg-[#2a2a2a]"
        >
          <Crown className="mr-3 h-4 w-4" />
          Upgrade plan
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            navigate("/settings?tab=personalization");
          }}
          className="cursor-pointer py-3 hover:bg-[#2a2a2a]"
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          Personalization
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            navigate("/settings");
          }}
          className="cursor-pointer py-3 hover:bg-[#2a2a2a]"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setOpen(false);
            navigate("/tickets");
          }}
          className="cursor-pointer py-3 hover:bg-[#2a2a2a]"
        >
          <MessageCircle className="mr-3 h-4 w-4" />
          My Tickets
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer py-3 hover:bg-[#2a2a2a]">
          <HelpCircle className="mr-3 h-4 w-4" />
          Help
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#2a2a2a]" />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-3 hover:bg-[#2a2a2a]">
          <LogOut className="mr-3 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
