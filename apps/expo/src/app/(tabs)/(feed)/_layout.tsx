import { Stack } from "expo-router";
import { PlusCircle } from "lucide-react-native";

import { HeaderButton, ThemeToggle } from "~/components/header";
import { useThemeColours } from "~/lib/theme";

import { createPostSheetRef } from "./index";

export default function FeedStack() {
  const theme = useThemeColours();

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: { backgroundColor: theme.surface },
        contentStyle: { backgroundColor: theme.background },
        headerTintColor: theme.foreground,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Feed",
          headerLeft: () => (
            <HeaderButton
              onPress={() => createPostSheetRef.current?.present()}
              accessibilityLabel="Create post"
            >
              <PlusCircle size={22} color={theme.primary} />
            </HeaderButton>

          ),
          headerRight: () => <ThemeToggle />,
        }}
      />
      < Stack.Screen
        name="post/[id]"
        options={{
          title: "Post",
        }}
      />
    </Stack >
  );
}
