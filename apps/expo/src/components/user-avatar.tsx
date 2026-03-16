import { useState } from "react";
import { Image, useColorScheme, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import initials from "initials";

import type { UserProfile } from "./types";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface UserAvatarProps {
  userProfile?: UserProfile;
  size?: "small" | "medium" | "large" | "extra-large";
}

const SIZES = {
  small: { px: 32, text: "text-sm", icon: 18 },
  medium: { px: 48, text: "text-lg", icon: 24 },
  large: { px: 80, text: "text-2xl", icon: 36 },
  "extra-large": { px: 120, text: "text-4xl", icon: 54 },
} as const;

export function UserAvatar({ userProfile, size = "medium" }: UserAvatarProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? "#FFFFFF" : "#000000";
  const [imgError, setImgError] = useState(false);

  const { px, text, icon } = SIZES[size];
  const dimensionStyle = { width: px, height: px, borderRadius: px / 2 };

  const fallbackInitials = userProfile
    ? initials(userProfile.name || (userProfile.email ?? "")).slice(0, 2)
    : null;

  if (userProfile?.image && !imgError) {
    return (
      <Image
        className="rounded-full bg-muted"
        style={dimensionStyle}
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
        className="items-center justify-center rounded-full border border-1 border-primary bg-muted"
        style={dimensionStyle}
      >
        <Text className={cn("font-medium text-muted-foreground text-center", text)}>
          {fallbackInitials}
        </Text>
      </View>
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full border border-primary"
      style={dimensionStyle}
    >
      <FontAwesome name="user" size={icon} color={color} />
    </View>
  );
}
