import type { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@supabase/auth-helpers-react";
import { useColorScheme } from "nativewind";

import { api } from "~/utils/api";
import { UserAvatar } from "./user-avatar";

function HeaderButton({
  children,
  onPress,
  accessibilityLabel,
  className,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  className?: string;
}) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Small delay to ensure haptics completes before navigation
    await new Promise((resolve) => setTimeout(resolve, 50));
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={() => void handlePress()}
      activeOpacity={0.6}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`items-center justify-center ${className}`}
    >
      {children}
    </TouchableOpacity>
  );
}

export function AuthAvatar() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const color = colorScheme == "dark" ? "#F2F2F3" : "#232325";
  const session = useSession();
  const userId = session?.user.id;
  const { data: userProfile } = api.user.getUserProfile.useQuery(undefined, {
    enabled: !!userId,
  });

  return (
    <HeaderButton
      onPress={() => router.push("/profile")}
      accessibilityLabel={userId ? "View profile" : "Log in"}
      className="p-1"
    >
      {userId && userProfile ? (
        <UserAvatar userProfile={userProfile} />
      ) : (
        <Entypo name="login" size={24} color={color} />
      )}
    </HeaderButton>
  );
}

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <HeaderButton
      onPress={toggleColorScheme}
      accessibilityLabel={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
      className="p-2"
    >
      <MaterialIcons
        name={colorScheme == "dark" ? "dark-mode" : "light-mode"}
        size={24}
        color={colorScheme == "dark" ? "white" : "black"}
      />
    </HeaderButton>
  );
}

export function HeaderBackButton() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  return (
    <HeaderButton
      onPress={() => router.back()}
      accessibilityLabel="Go back"
      className="justify-center px-2"
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={colorScheme == "dark" ? "#F2F2F3" : "#232325"}
      />
    </HeaderButton>
  );
}

export function HeaderTitle(props: { children: ReactNode }) {
  return (
    <Text className="text-xl font-bold text-primary">{props.children}</Text>
  );
}
