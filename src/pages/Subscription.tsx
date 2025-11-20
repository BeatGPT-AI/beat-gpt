import { useState } from "react";
import SubscriptionModal from "@/components/modals/SubscriptionModal";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Subscription() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      navigate("/chat");
    }
  }, [open, navigate]);

  return <SubscriptionModal open={open} onOpenChange={setOpen} />;
}
