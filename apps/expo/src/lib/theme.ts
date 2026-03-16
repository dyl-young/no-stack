import { useColorScheme } from "react-native";

/**
 * JS colour constants derived from CSS variables in styles.css.
 * Used where NativeWind className cannot be applied (react-navigation
 * headerStyle/tabBarStyle/contentStyle, icon colour props, Toaster config).
 */
export const THEME_COLOURS = {
  light: {
    background: "hsl(0, 0%, 100%)",
    surface: "hsl(240, 5%, 96%)",
    foreground: "hsl(240, 10%, 3.9%)",
    primary: "hsl(240, 5.9%, 10%)",
    primaryForeground: "hsl(0, 0%, 98%)",
    mutedForeground: "hsl(240, 3.8%, 46.1%)",
    border: "hsl(240, 5.9%, 90%)",
    destructive: "hsl(0, 84.2%, 60.2%)",
  },
  dark: {
    background: "hsl(240, 10%, 3.9%)",
    surface: "hsl(240, 4%, 14%)",
    foreground: "hsl(0, 0%, 98%)",
    primary: "hsl(0, 0%, 100%)",
    primaryForeground: "hsl(337, 65.5%, 17.1%)",
    mutedForeground: "hsl(240, 5%, 64.9%)",
    border: "hsl(240, 3.7%, 15.9%)",
    destructive: "hsl(0, 62.8%, 30.6%)",
  },
} as const;

export type ThemeColours = (typeof THEME_COLOURS)["light"];

export function useThemeColours() {
  const colorScheme = useColorScheme();
  return THEME_COLOURS[colorScheme ?? "light"];
}
