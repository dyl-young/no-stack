"use client";

import { useQueryClient } from "@tanstack/react-query";

import { signOut } from "~/app/auth/actions";
import { Button } from "@/components/ui/button";

export function SignOutButtonSlim() {
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    // Clear all React Query cache before signing out
    queryClient.clear();
    await signOut();
  };

  return (
    <span
      className="block w-full cursor-pointer text-left"
      onClick={handleSignOut}
    >
      Sign out
    </span>
  );
}

export function SignOutButton() {
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    // Clear all React Query cache before signing out
    queryClient.clear();
    await signOut();
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
