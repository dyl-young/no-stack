import { Stack } from "expo-router";

import { ThemeToggle } from "~/components/header";
import { useThemeColours } from "~/lib/theme";

export default function ChatStack() {
  const theme = useThemeColours();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        contentStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack>
  );
}
