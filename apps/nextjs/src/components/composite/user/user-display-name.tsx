"use client";

import { api } from "@/trpc/react";

export function UserDisplayName({
  preferEmail = false,
}: { preferEmail?: boolean } = {}) {
  const { data: user, isLoading: isLoadingAuth } = api.auth.me.useQuery();

  // Only query user profile if auth check is complete AND user is authenticated
  const shouldQueryProfile = !isLoadingAuth && !!user;
  const { data: userProfile, isLoading: _isLoading } =
    api.user.getUserProfile.useQuery(undefined, {
      enabled: shouldQueryProfile,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  if (isLoadingAuth) {
    return (
      <span className="inline-block h-4 w-24 animate-pulse rounded bg-primary/10" />
    );
  }
  const hasName = userProfile?.name && userProfile.name.trim() !== "";
  const displayName = hasName ? userProfile.name : userProfile?.email;

  // When preferEmail, hide if it would duplicate the name line
  if (preferEmail && !hasName) {
    return null;
  }

  return <span>{preferEmail ? userProfile?.email : displayName}</span>;
}
