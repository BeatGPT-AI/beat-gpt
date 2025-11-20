import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/forever",
      icon: Sparkles,
      features: [
        "20 chats every 4 hours",
        "5 photos every 4 hours",
        "Basic chat features",
        "Standard response time",
        "Community support"
      ],
      current: true,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Plus",
      price: "$9.99",
      period: "/per month",
      icon: Zap,
      popular: true,
      features: [
        "100 chats every 6 hours",
        "15 photos every 6 hours",
        "Priority responses",
        "Advanced features",
        "Email support"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Premium",
      price: "$29.99",
      period: "/per month",
      icon: Crown,
      features: [
        "Unlimited messages",
        "Fastest response times",
        "All premium features",
        "Priority support 24/7",
        "Unlimited photo uploads",
        "Early access to new features"
      ],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl bg-[#0a0a0a] border-[#2a2a2a]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">
            Upgrade to BeatGPT Premium
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Choose the perfect plan for your needs and unlock powerful features
          </p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative p-6 bg-[#1a1a1a] border-2 ${
                  plan.popular ? "border-cyan-500" : "border-[#2a2a2a]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.current
                      ? "bg-[#2a2a2a] text-muted-foreground cursor-default hover:bg-[#2a2a2a]"
                      : plan.popular
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? "Current Plan" : "Purchase"}
                </Button>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          All plans include access to BeatGPT core features. Cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  );
}
