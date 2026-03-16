import { ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useThemeColours } from "~/lib/theme";
import { confirmDelete } from "~/lib/utils";
import { useTRPC } from "~/utils/api";
import { Trash2 } from "lucide-react-native";
import { HeaderButton } from "~/components/header";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const theme = useThemeColours();
  const postQuery = useQuery(trpc.post.byId.queryOptions({ id }));

  const { mutate: deletePost } = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: async () => {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        toast.success("Post deleted!");
        router.back();
        await queryClient.invalidateQueries({
          queryKey: trpc.post.all.queryKey(),
        });
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Only the author can delete this post.");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      },
    }),
  );

  const handleDelete = () => {
    confirmDelete(() => deletePost(id));
  };

  if (postQuery.isLoading) {
    return (
      <View style={{ flex: 1, gap: 16, padding: 16 }}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-32" />
      </View>
    );
  }

  if (postQuery.isError) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}
      >
        <Text style={{ marginBottom: 16, color: theme.mutedForeground }}>
          Failed to load post
        </Text>
        <Button onPress={() => void postQuery.refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (!postQuery.data) {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}
      >
        <Text style={{ color: theme.mutedForeground }}>Post not found</Text>
      </View>
    );
  }

  const post = postQuery.data;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 16, gap: 8 }}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderButton
              onPress={handleDelete}
              accessibilityLabel="Delete post"
              className="px-2"
            >
              <Trash2 size={20} color={theme.primary} />
            </HeaderButton>
          ),
        }}
      />
      <Text selectable style={{ fontSize: 28, fontWeight: "700", color: theme.foreground }}>
        {post.title}
      </Text>
      <Text selectable style={{ fontSize: 15, color: theme.mutedForeground }}>
        by {post.author.name || post.author.email}
      </Text>
      <Text
        selectable
        style={{ fontSize: 17, lineHeight: 24, marginTop: 12, color: theme.foreground }}
      >
        {post.content}
      </Text>
    </ScrollView>
  );
}
