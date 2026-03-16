import type { ReactNode } from "react";
import { Appearance, TouchableOpacity, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

import { useThemeColours } from "~/lib/theme";

export function HeaderButton({
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
      className={`items-center justify-center px-3 text-primary ${className}`}
    >
      {children}
    </TouchableOpacity>
  );
}

export function ThemeToggle() {
  const colorScheme = useColorScheme();
  const theme = useThemeColours();

  return (
    <HeaderButton
      onPress={() =>
        Appearance.setColorScheme(colorScheme === "dark" ? "light" : "dark")
      }
      accessibilityLabel={`Switch to ${colorScheme === "dark" ? "light" : "dark"} mode`}
    >
      <MaterialIcons
        name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
        size={22}
        color={theme.foreground}
      />
    </HeaderButton>
  );
}
