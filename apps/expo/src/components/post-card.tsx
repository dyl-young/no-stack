import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { Link, router } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import initials from "initials";
import { toast } from "sonner-native";

import type { RouterOutputs } from "~/utils/api";
import { Text } from "~/components/ui/text";
import { useThemeColours } from "~/lib/theme";
import { confirmDelete } from "~/lib/utils";
import { useTRPC } from "~/utils/api";
import { Trash2 } from "lucide-react-native";

function PostAuthorAvatar({
  image,
  name,
  email,
}: {
  image: string | null;
  name: string | null;
  email: string | null;
}) {
  const [imgError, setImgError] = useState(false);
  const theme = useThemeColours();
  const fallback = initials(name ?? email ?? "").slice(0, 2) || "?";

  if (image && !imgError) {
    return (
      <Image
        source={{ uri: image }}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: theme.border,
        }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "500", color: theme.mutedForeground }}>
        {fallback}
      </Text>
    </View>
  );
}

export function PostCard({
  post,
}: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const theme = useThemeColours();

  const { mutate: deletePost } = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Post deleted successfully!");
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.post.all.queryKey(),
        }),
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("Only the author can delete their post.");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      },
    }),
  );

  const handleDelete = () => confirmDelete(() => deletePost(post.id));

  return (
    <Link
      href={{
        pathname: "/post/[id]",
        params: { id: post.id },
      }}
      asChild
    >
      <Link.Trigger>
        <Pressable
          style={{
            backgroundColor: theme.surface,
            borderRadius: 12,
            borderCurve: "continuous",
            padding: 14,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          <PostAuthorAvatar
            image={post.author.image}
            name={post.author.name}
            email={post.author.email}
          />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Text
                style={{ fontSize: 17, fontWeight: "600", color: theme.foreground, flex: 1 }}
                numberOfLines={2}
              >
                {post.title}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                style={{ paddingLeft: 8, paddingVertical: 2 }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: theme.destructive }}>
                  <Trash2 size={16} color={theme.primary} />
                </Text>
              </Pressable>
            </View>
            <Text
              style={{ fontSize: 15, color: theme.mutedForeground }}
              numberOfLines={2}
            >
              {post.content}
            </Text>
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="Delete"
          icon="trash"
          destructive
          onPress={handleDelete}
        />
        <Link.MenuAction
          title="Back"
          onPress={() => router.back()}
          icon="arrow.left"
        />
      </Link.Menu>
    </Link>
  );
}
