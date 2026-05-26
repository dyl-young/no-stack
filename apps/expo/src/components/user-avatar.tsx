import { useState } from "react";
import { Image, View } from "react-native";
import { User } from "lucide-react-native";

import type { UserProfile } from "./types";
import { useThemeColours } from "~/lib/theme";

interface UserAvatarProps {
  userProfile?: UserProfile;
  size?: "small" | "medium" | "large" | "extra-large";
}

const SIZES = {
  small: { px: 32, icon: 18 },
  medium: { px: 48, icon: 24 },
  large: { px: 80, icon: 36 },
  "extra-large": { px: 120, icon: 54 },
} as const;

export function UserAvatar({ userProfile, size = "medium" }: UserAvatarProps) {
  const theme = useThemeColours();
  const [imgError, setImgError] = useState(false);

  const { px, icon } = SIZES[size];

  if (userProfile?.image && !imgError) {
    return (
      <Image
        style={{ width: px, height: px, borderRadius: px / 2 }}
        source={{ uri: userProfile.image }}
        resizeMode="cover"
        alt="User Avatar"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View
      style={{
        width: px,
        height: px,
        borderRadius: px / 2,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <User size={icon} color={theme.mutedForeground} />
    </View>
  );
}
