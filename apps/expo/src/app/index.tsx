import { useState } from "react";
import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

import { GoogleSignInCancelledError, signInWithGoogle } from "~/utils/auth";
import { useUser } from "~/utils/session";

export default function Home() {
  const user = useUser();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login() {
    setBusy(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (e) {
      if (!(e instanceof GoogleSignInCancelledError))
        setError(e instanceof Error ? e.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ padding: 24, gap: 12 }}>
      {user ? (
        <Link href="/account">Account</Link>
      ) : (
        <Button title="Continue with Google" disabled={busy} onPress={login} />
      )}
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
    </View>
  );
}
