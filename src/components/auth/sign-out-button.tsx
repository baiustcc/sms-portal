"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SignOutButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    const res = await fetch("/api/auth/signout", { method: "POST" });
    if (!res.ok) {
      toast.error("Unable to sign out");
      return;
    }
    router.replace("/signin");
  };

  return (
    <Button variant="secondary" className="w-full" onClick={handleClick}>
      Sign out
    </Button>
  );
};

