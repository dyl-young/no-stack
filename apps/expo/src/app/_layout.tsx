import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";
import { SessionContextProvider, useSessionContext } from "~/utils/session";
import { supabase } from "~/utils/supabase";

function Routes() {
  const { session, isLoading } = useSessionContext();
  if (isLoading) return null;
  return (
    <TRPCProvider key={session?.user.id ?? "signed-out"}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="account" options={{ title: "Account" }} />
        </Stack.Protected>
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
      </Stack>
    </TRPCProvider>
  );
}
export default function Layout() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <StatusBar style="auto" />
      <Routes />
    </SessionContextProvider>
  );
}
