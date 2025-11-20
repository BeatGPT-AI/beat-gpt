import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import CustomGPTs from "./pages/CustomGPTs";
import Subscription from "./pages/Subscription";
import Tickets from "./pages/Tickets";

const queryClient = new QueryClient();

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={session ? <Navigate to="/chat" /> : <Index />} />
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/chat" />} />
            <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/chat" />} />
            <Route path="/chat" element={session ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/chat/:conversationId" element={session ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/admin" element={session ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/gpts" element={session ? <CustomGPTs /> : <Navigate to="/login" />} />
            <Route path="/subscription" element={session ? <Subscription /> : <Navigate to="/login" />} />
            <Route path="/tickets" element={session ? <Tickets /> : <Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
