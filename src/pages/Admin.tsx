import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquare, Bell, Settings } from "lucide-react";

export default function Admin() {
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*");
      return data;
    },
  });

  const { data: conversations } = useQuery({
    queryKey: ["admin-conversations"],
    queryFn: async () => {
      const { data } = await supabase.from("chat_conversations").select("*");
      return data;
    },
  });

  const { data: tickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data } = await supabase.from("support_tickets").select("*");
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{profiles?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold">{conversations?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Support Tickets</p>
                <p className="text-2xl font-bold">{tickets?.length || 0}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">User Management</h2>
              <div className="space-y-2">
                {profiles?.map((profile) => (
                  <div key={profile.id} className="flex justify-between items-center p-3 border border-border rounded">
                    <div>
                      <p className="font-medium">{profile.full_name || "No name"}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="conversations">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
              <div className="space-y-2">
                {conversations?.slice(0, 10).map((conv) => (
                  <div key={conv.id} className="p-3 border border-border rounded">
                    <p className="font-medium">{conv.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Support Tickets</h2>
              <div className="space-y-2">
                {tickets?.map((ticket) => (
                  <div key={ticket.id} className="p-3 border border-border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">{ticket.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-500' :
                        ticket.status === 'resolved' ? 'bg-green-500/20 text-green-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">System Settings</h2>
              <p className="text-muted-foreground">System configuration coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
