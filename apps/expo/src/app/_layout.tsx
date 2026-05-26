import "@bacons/text-decoder/install";

import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Toaster } from "sonner-native";

import { useThemeColours } from "~/lib/theme";
import { TRPCProvider } from "~/utils/api";
import { SessionContextProvider } from "~/utils/session";
import { supabase } from "~/utils/supabase";

import "../../polyfills";
import "../styles.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useThemeColours();

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports -- Reactotron dev-only dynamic require
    const { default: tron } = require("~/utils/reactotron");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.tron = tron;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SessionContextProvider supabaseClient={supabase}>
          <TRPCProvider>
            <BottomSheetModalProvider>
              <Slot />
              <Toaster
                duration={3000}
                theme={colorScheme === "dark" ? "dark" : "light"}
                toastOptions={{
                  style: {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    borderWidth: 1,
                  },
                  titleStyle: { color: theme.foreground },
                  descriptionStyle: { color: theme.mutedForeground },
                }}
              />
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            </BottomSheetModalProvider>
          </TRPCProvider>
        </SessionContextProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
