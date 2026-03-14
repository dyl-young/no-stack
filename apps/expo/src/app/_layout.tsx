import "@bacons/text-decoder/install";

import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useColorScheme } from "nativewind";
import { Toaster } from "sonner-native";

import {
  HeaderBackButton,
  HeaderTitle,
  ThemeToggle,
} from "~/components/header";
import { TRPCProvider } from "~/utils/api";
import { supabase } from "~/utils/supabase";

import "../../polyfills";
import "../styles.css";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports -- Reactotron dev-only dynamic require
    const { default: tron } = require("~/utils/reactotron");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    console.tron = tron;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#232325" : "#F2F2F3",
      }}
    >
      <GestureHandlerRootView>
        <SessionContextProvider supabaseClient={supabase}>
          <TRPCProvider>
            <BottomSheetModalProvider>
              {/*
               * The Stack component displays the current page.
               * It also allows you to configure your screens
               */}
              <Stack
                screenOptions={{
                  headerLeft: () => <HeaderBackButton />,
                  headerTitle: (props) => (
                    <HeaderTitle>{props.children}</HeaderTitle>
                  ),
                  headerStyle: {
                    backgroundColor:
                      colorScheme == "dark" ? "#232325" : "#F2F2F3",
                  },
                  headerRight: () => <ThemeToggle />,
                  contentStyle: {
                    backgroundColor:
                      colorScheme == "dark" ? "#09090B" : "#FFFFFF",
                  },
                }}
              >
                {/*
                 * Present the profile screen as a modal
                 * @see https://expo.github.io/router/docs/guides/modals
                 */}
                <Stack.Screen
                  name="profile"
                  options={{
                    presentation: "modal",
                    headerTitle: () => <></>,
                  }}
                />
              </Stack>
              <Toaster
                theme={colorScheme === "dark" ? "dark" : "light"}
                toastOptions={{
                  duration: 3000,
                  style: {
                    backgroundColor:
                      colorScheme === "dark" ? "#232325" : "#F2F2F3",
                    borderColor: colorScheme === "dark" ? "#3F3F46" : "#D4D4D8",
                    borderWidth: 1,
                  },
                  titleStyle: {
                    color: colorScheme === "dark" ? "#FAFAFA" : "#18181B",
                  },
                  descriptionStyle: {
                    color: colorScheme === "dark" ? "#A1A1AA" : "#71717A",
                  },
                }}
              />
              <StatusBar style={colorScheme == "dark" ? "light" : "dark"} />
            </BottomSheetModalProvider>
          </TRPCProvider>
        </SessionContextProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
