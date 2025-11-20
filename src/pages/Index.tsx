import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Shield, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-8">
            <MessageSquare className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to BeatGPT
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Your unlimited AI assistant. Ask anything and get intelligent, detailed responses.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-6 rounded-lg bg-card border border-border">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Powerful AI</h3>
              <p className="text-muted-foreground">
                Advanced AI models for accurate and helpful responses
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-muted-foreground">
                Lightning-fast responses with 99.9% uptime
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your conversations are encrypted and private
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
