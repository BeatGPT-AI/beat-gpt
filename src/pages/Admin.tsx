import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, Activity, MessageSquare, Globe } from "lucide-react";

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

  const { data: loginDevices } = useQuery({
    queryKey: ["admin-devices"],
    queryFn: async () => {
      const { data } = await supabase.from("login_devices").select("*");
      return data;
    },
  });

  const uniqueIPs = loginDevices ? [...new Set(loginDevices.map(d => d.ip_address))].length : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Navigation */}
      <div className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="flex items-center gap-8 px-8 h-14">
          <button className="text-foreground font-medium border-b-2 border-primary pb-4">Dashboard</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Users</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Chat Logs</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Login Logs</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Support</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Security</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Billing</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Support Tools</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Admins</button>
          <button className="text-muted-foreground hover:text-foreground pb-4">Announcements</button>
        </div>
      </div>

      <div className="p-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{profiles?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-bold">0</p>
                <p className="text-xs text-muted-foreground mt-1">Online in last 15 min</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Chats</p>
                <p className="text-3xl font-bold">{conversations?.length || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Conversations created</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Login Locations</p>
                <p className="text-3xl font-bold">{uniqueIPs}</p>
                <p className="text-xs text-muted-foreground mt-1">Unique locations</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Users</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">0</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Users currently using the bot</p>
            <div className="mt-6 text-center py-8">
              <p className="text-muted-foreground">No active users</p>
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border-[#2a2a2a]">
            <h2 className="text-lg font-semibold mb-4">Login Locations</h2>
            <p className="text-sm text-muted-foreground mb-6">Where users are connecting from</p>
            <div className="space-y-3">
              {loginDevices?.slice(0, 6).map((device, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <span className="text-sm font-mono">{device.ip_address || "Unknown"}</span>
                  <span className="text-sm text-muted-foreground">
                    {loginDevices.filter(d => d.ip_address === device.ip_address).length} login{loginDevices.filter(d => d.ip_address === device.ip_address).length > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
