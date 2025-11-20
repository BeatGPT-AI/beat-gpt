import { Crown, MessageSquare, Image } from "lucide-react";
import UserMenu from "./UserMenu";

export default function ChatTopBar() {
  return (
    <div className="h-14 border-b border-[#2a2a2a] bg-[#0a0a0a] px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">BeatGPT 1.1</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <Crown className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground">Premium</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Chats: <span className="text-foreground">Unlimited</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Photos: <span className="text-foreground">Unlimited</span>
          </span>
        </div>

        <UserMenu />
      </div>
    </div>
  );
}
