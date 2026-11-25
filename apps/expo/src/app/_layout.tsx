import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";
import { SessionContextProvider, useSession } from "~/utils/session";

function Routes() {
  const { token } = useSession();
  return (
    <TRPCProvider key={token ?? "signed-out"}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Protected guard={!!token}>
          <Stack.Screen name="account" options={{ title: "Account" }} />
        </Stack.Protected>
      </Stack>
    </TRPCProvider>
  );
}
export default function Layout() {
  return (
    <SessionContextProvider>
      <StatusBar style="auto" />
      <Routes />
    </SessionContextProvider>
  );
}
