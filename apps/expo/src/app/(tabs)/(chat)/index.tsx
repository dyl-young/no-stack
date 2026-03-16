import type { UIMessage } from "ai";
import { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { randomUUID } from "expo-crypto";
import { fetch as expoFetch } from "expo/fetch";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useThemeColours } from "~/lib/theme";
import { generateAPIUrl } from "~/utils/api";

export default function ChatScreen() {
  const theme = useThemeColours();
  const insets = useSafeAreaInsets();
  const supabase = useSupabaseClient();
  const flatListRef = useRef<FlatList>(null);
  const [text, setText] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    generateId: () => randomUUID(),
    transport: new DefaultChatTransport({
      api: generateAPIUrl("/api/chat"),
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      headers: async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        const h: Record<string, string> = {};
        if (token) h.authorization = token;
        return h;
      },
    }),
    onError: (err) => console.error("Chat error:", err),
  });

  const isLoading = status === "streaming" || status === "submitted";

  function handleSend() {
    if (!text.trim() || isLoading) return;
    const msg = text;
    setText("");
    sendMessage({ text: msg }).catch(console.error);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={16}
    >
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={messages}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item: m }) => {
          const isUser = m.role === "user";
          return (
            <View
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "80%",
                backgroundColor: isUser ? theme.primary : theme.surface,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  opacity: 0.7,
                  color: isUser ? theme.primaryForeground : theme.foreground,
                  marginBottom: 4,
                }}
              >
                {isUser ? "You" : "Assistant"}
              </Text>
              {m.parts.map((part: UIMessage["parts"][number], i: number) =>
                part.type === "text" ? (
                  <Text
                    key={i}
                    style={{
                      color: isUser
                        ? theme.primaryForeground
                        : theme.foreground,
                    }}
                  >
                    {part.text}
                  </Text>
                ) : null,
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.mutedForeground }}>
              Send a message to start chatting
            </Text>
          </View>
        }
      />

      {error && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
          <Text style={{ color: theme.destructive, fontSize: 13 }}>
            Error: {error.message}
          </Text>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          padding: 16,
          paddingTop: 8,
          paddingBottom: insets.bottom + 49 + 8,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.background,
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!isLoading}
          />
        </View>
        <Button
          onPress={handleSend}
          disabled={isLoading || !text.trim()}
          size="default"
        >
          <Text>Send</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
