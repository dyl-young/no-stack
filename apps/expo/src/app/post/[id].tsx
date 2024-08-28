import { Text, View } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";

import { api } from "~/utils/api";

export default function Post() {
  const { id } = useGlobalSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = api.post.byId.useQuery({ id });

  return (
    <View className="h-full w-full bg-background p-4">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className="text-xl font-bold text-primary">
              {data ? data.title : "Title"}
            </Text>
          ),
        }}
      />
      {data && (
        <View className="h-full w-full p-4">
          <Text className="py-2 text-3xl font-bold text-primary">
            {data.title}
          </Text>
          <Text className="py-4 text-foreground">{data.content}</Text>
        </View>
      )}
    </View>
  );
}
