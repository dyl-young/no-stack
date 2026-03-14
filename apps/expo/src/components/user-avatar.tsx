import { useState } from "react";
import { Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import initials from "initials";
import { useColorScheme } from "nativewind";

import type { UserProfile } from "./types";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface UserAvatarProps {
  userProfile?: UserProfile;
  size?: "small" | "medium" | "large";
}

export function UserAvatar({ userProfile, size = "medium" }: UserAvatarProps) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme == "dark" ? "#FFFFFF" : "#000000";
  const [imgError, setImgError] = useState(false);

  const sizeClass =
    size === "small" ? "h-6 w-6" : size === "medium" ? "h-8 w-8" : "h-10 w-10";
  const textSize =
    size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base";
  const iconSize = size === "small" ? 16 : size === "medium" ? 24 : 32;

  const fallbackInitials = userProfile
    ? initials(userProfile.name || (userProfile.email ?? "")).slice(0, 2)
    : null;

  if (userProfile?.image && !imgError) {
    return (
      <Image
        className={cn("rounded-full bg-muted", sizeClass)}
        source={{ uri: userProfile.image }}
        resizeMode="cover"
        alt="User Avatar"
        onError={() => setImgError(true)}
      />
    );
  }

  if (fallbackInitials) {
    return (
      <View
        className={cn(
          "items-center justify-center rounded-full bg-muted",
          sizeClass,
        )}
      >
        <Text className={cn("font-medium text-muted-foreground", textSize)}>
          {fallbackInitials}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "items-center justify-center rounded-full border border-primary",
        sizeClass,
      )}
    >
      <FontAwesome name="user" size={iconSize} color={color} />
    </View>
  );
}
