import { useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/utils/api";
import { useSession } from "~/utils/session";

export default function Account() {
  const { logout: signOutAccount, clear, token } = useSession();
  const trpc = useTRPC();
  const profile = useQuery(trpc.account.me.queryOptions());
  const remove = useMutation(trpc.account.remove.mutationOptions());
  const [message, setMessage] = useState("");
  async function signOut() {
    try {
      await signOutAccount();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sign-out failed");
    }
  }
  async function deleteAccount() {
    try {
      await remove.mutateAsync();
      if (token) await clear(token);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Deletion failed");
    }
  }
  function confirm() {
    Alert.alert(
      "Delete account?",
      "This permanently deletes your app account.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => void deleteAccount(),
        },
      ],
    );
  }
  return (
    <View style={{ padding: 24, gap: 12 }}>
      {profile.data?.avatarUrl && (
        <Image
          source={{ uri: profile.data.avatarUrl }}
          style={{ width: 56, height: 56, borderRadius: 28 }}
        />
      )}
      <Text>{profile.data?.name}</Text>
      <Text>{profile.data?.email}</Text>
      <Button title="Sign out" disabled={remove.isPending} onPress={signOut} />
      <Button
        title="Delete account"
        disabled={remove.isPending}
        onPress={confirm}
      />
      {(message || profile.error) && (
        <Text accessibilityRole="alert">
          {message || profile.error?.message}
        </Text>
      )}
    </View>
  );
}
