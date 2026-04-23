"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import initials from "initials";
import { User } from "lucide-react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useTRPC } from "~/trpc/react";

interface UserAvatarProps {
  /** Override the image URL directly */
  imageUrl?: string;
  /** Provide user name directly (skips fetching current user) */
  name?: string | null;
  /** Provide user email directly (used for initials fallback) */
  email?: string | null;
}

export function UserAvatar({ imageUrl, name, email }: UserAvatarProps = {}) {
  const [imgError, setImgError] = useState(false);
  const hasUserData = name !== undefined || email !== undefined;

  const trpc = useTRPC();
  const { data: user, isLoading: isLoadingAuth } = useQuery({
    ...trpc.auth.me.queryOptions(),
    enabled: !hasUserData,
  });

  const shouldQueryProfile = !hasUserData && !isLoadingAuth && !!user;
  const { data: userProfile, isLoading } = useQuery({
    ...trpc.user.getUserProfile.queryOptions(),
    enabled: shouldQueryProfile,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const resolvedName = hasUserData ? name : userProfile?.name;
  const resolvedEmail = hasUserData ? email : userProfile?.email;
  const resolvedImage =
    imageUrl ?? (hasUserData ? undefined : userProfile?.image) ?? undefined;

  const userInitials = initials(resolvedName ?? resolvedEmail ?? "").slice(
    0,
    2,
  );

  // Ref callback catches images that failed before React hydration
  const imgRef = useCallback(
    (el: HTMLImageElement | null) => {
      if (el && el.complete && el.naturalWidth === 0) {
        setImgError(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedImage],
  );

  if (!hasUserData && (isLoading || isLoadingAuth)) {
    return (
      <Avatar className="h-full w-full">
        <AvatarFallback />
      </Avatar>
    );
  }

  if (resolvedImage && !imgError) {
    return (
      <Avatar key={resolvedImage} className="h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={resolvedImage}
          alt="Profile picture"
          className="aspect-square h-full w-full rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      </Avatar>
    );
  }

  return (
    <Avatar className="h-full w-full">
      <AvatarFallback>{userInitials || <User />}</AvatarFallback>
    </Avatar>
  );
}
