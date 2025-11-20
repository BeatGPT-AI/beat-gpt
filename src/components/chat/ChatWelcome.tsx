import { Card } from "@/components/ui/card";
import { Sparkles, MessageCircle } from "lucide-react";

export default function ChatWelcome() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-foreground mb-12">
        How can I help you today?
      </h2>

      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
        <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a] hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
            <Sparkles className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Generate an image</h3>
          <p className="text-sm text-muted-foreground">Create stunning visuals</p>
        </Card>

        <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a] hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:bg-purple-500/20 transition-colors">
            <MessageCircle className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Ask a question</h3>
          <p className="text-sm text-muted-foreground">Get instant answers</p>
        </Card>
      </div>
    </div>
  );
}
