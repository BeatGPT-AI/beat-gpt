import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Smartphone } from "lucide-react";

export default function Settings() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState({ full_name: "", avatar_url: "" });
  const [personalization, setPersonalization] = useState({
    nickname: "",
    occupation: "",
    more_about: "",
    language: "en",
    theme: "system",
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      if (data) setProfile(data);
      return data;
    },
  });

  useQuery({
    queryKey: ["personalization", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("personalization")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (data) setPersonalization(data);
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
  });

  const updatePersonalizationMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("personalization")
        .upsert({ ...personalization, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalization"] });
      toast.success("Personalization updated successfully");
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="personalization" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Personalization
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Devices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profile.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <Button onClick={() => updateProfileMutation.mutate()}>
                Save Profile
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="personalization">
            <Card className="p-6 space-y-4">
              <div>
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={personalization.nickname || ""}
                  onChange={(e) =>
                    setPersonalization({ ...personalization, nickname: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={personalization.occupation || ""}
                  onChange={(e) =>
                    setPersonalization({ ...personalization, occupation: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="more_about">Tell us more about yourself</Label>
                <Textarea
                  id="more_about"
                  value={personalization.more_about || ""}
                  onChange={(e) =>
                    setPersonalization({ ...personalization, more_about: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <Button onClick={() => updatePersonalizationMutation.mutate()}>
                Save Personalization
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <p className="text-muted-foreground">Notification preferences coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card className="p-6">
              <p className="text-muted-foreground">Device management coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
