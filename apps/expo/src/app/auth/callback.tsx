import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";

import { finishSignIn } from "~/utils/auth";

export default function Callback() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!code) return;
    let active = true;
    void finishSignIn(code).then(
      () => {
        if (active) router.replace("/");
      },
      () => {
        if (active) setFailed(true);
      },
    );
    return () => {
      active = false;
    };
  }, [code, router]);
  if (failed || !code)
    return (
      <>
        <Text>Sign-in failed.</Text>
        <Link href="/">Return home</Link>
      </>
    );
  return <Text>Signing in…</Text>;
}
