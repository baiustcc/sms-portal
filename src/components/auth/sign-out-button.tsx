"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export const SignOutButton = () => {
  const handleClick = async () => {
    await signOut({ callbackUrl: "/signin" });
  };
  return (
    <Button variant="secondary" className="w-full" onClick={handleClick}>
      Sign out
    </Button>
  );
};







