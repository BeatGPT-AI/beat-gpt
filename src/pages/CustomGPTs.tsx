import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";

export default function CustomGPTs() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGPT, setNewGPT] = useState({
    name: "",
    description: "",
    instructions: "",
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: gpts } = useQuery({
    queryKey: ["custom-gpts"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("custom_gpts")
        .select("*")
        .eq("user_id", user.user!.id);
      return data;
    },
  });

  const createGPTMutation = useMutation({
    mutationFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("custom_gpts")
        .insert({
          ...newGPT,
          user_id: user.user!.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["custom-gpts"] });
      toast.success("Custom GPT created successfully");
      setShowCreateForm(false);
      setNewGPT({ name: "", description: "", instructions: "" });
      navigate(`/chat?gpt=${data.id}`);
    },
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Custom GPTs</h1>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Create GPT
          </Button>
        </div>

        {showCreateForm && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Create a Custom GPT</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newGPT.name}
                  onChange={(e) => setNewGPT({ ...newGPT, name: e.target.value })}
                  placeholder="e.g., Code Helper"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGPT.description}
                  onChange={(e) => setNewGPT({ ...newGPT, description: e.target.value })}
                  placeholder="A brief description of your GPT"
                />
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newGPT.instructions}
                  onChange={(e) => setNewGPT({ ...newGPT, instructions: e.target.value })}
                  placeholder="Tell the AI how to behave..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => createGPTMutation.mutate()}>
                  Create
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gpts?.map((gpt) => (
            <Card
              key={gpt.id}
              className="p-6 hover:border-primary cursor-pointer transition-colors"
              onClick={() => navigate(`/chat?gpt=${gpt.id}`)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{gpt.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {gpt.description || "No description"}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Used {gpt.usage_count || 0} times
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
