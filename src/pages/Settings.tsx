import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/chat">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <div className="space-y-6">
          <p className="text-muted-foreground">Settings page coming soon...</p>
        </div>
      </div>
    </div>
  );
}
