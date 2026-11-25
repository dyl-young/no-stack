import { useState } from "react";
import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

import { localGoogle } from "~/utils/auth";
import { useSession } from "~/utils/session";

export default function Home() {
  const { token, login: signInWithGoogle } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(localUser?: string) {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle(localUser);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ padding: 24, gap: 12 }}>
      {token ? (
        <Link href="/account">Account</Link>
      ) : (
        <>
          <Button
            title={
              localGoogle ? "Continue as Alice (local)" : "Continue with Google"
            }
            disabled={busy}
            onPress={() => login()}
          />
          {localGoogle && (
            <Button
              title="Continue as Bob (local)"
              disabled={busy}
              onPress={() => login("bob")}
            />
          )}
        </>
      )}
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
    </View>
  );
}
