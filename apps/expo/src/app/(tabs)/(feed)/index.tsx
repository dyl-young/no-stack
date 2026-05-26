import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Keyboard, View } from "react-native";
import * as Haptics from "expo-haptics";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner-native";

import { PostCard } from "~/components/post-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Text } from "~/components/ui/text";
import { useThemeColours } from "~/lib/theme";
import { useTRPC } from "~/utils/api";

export const createPostSheetRef = React.createRef<BottomSheetModal>();

function CreatePostSheet() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const theme = useThemeColours();
  const snapPoints = useMemo(() => ["70%", "90%"], []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate: createPost, error } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        setTitle("");
        setContent("");
        Keyboard.dismiss();
        createPostSheetRef.current?.dismiss();
        await queryClient.invalidateQueries({
          queryKey: trpc.post.all.queryKey(),
        });
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        toast.success("Post created!");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.error("You must be logged in to create a post.");
        } else {
          toast.error("Something went wrong, please try again.");
        }
      },
    }),
  );

  const fieldErrors = error?.data?.zodError?.fieldErrors;

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={createPostSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      handleIndicatorStyle={{ backgroundColor: theme.mutedForeground }}
      backgroundStyle={{ backgroundColor: theme.surface }}
    >
      <BottomSheetView
        style={{ flex: 1, flexDirection: "column", padding: 20, gap: 16 }}
      >
        <Text
          style={{ fontSize: 22, fontWeight: "700", color: theme.foreground }}
        >
          New Post
        </Text>

        <View style={{ gap: 12, paddingBottom: 16 }}>
          <Input value={title} onChangeText={setTitle} placeholder="Title" />
          {fieldErrors?.title && (
            <Text style={{ color: "red", fontSize: 13 }}>
              {fieldErrors.title}
            </Text>
          )}

          <Input
            value={content}
            onChangeText={setContent}
            placeholder="Content"
            multiline
            numberOfLines={4}
            style={{
              minHeight: 80,
              textAlignVertical: "top",
              marginBottom: 26,
            }}
          />
          {fieldErrors?.content && (
            <Text style={{ color: "red", fontSize: 13 }}>
              {fieldErrors.content}
            </Text>
          )}
        </View>

        <Button onPress={() => createPost({ title, content })}>
          <Text>Create</Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

export default function FeedScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const theme = useThemeColours();

  const postQuery = useQuery(trpc.post.all.queryOptions());

  if (postQuery.isLoading) {
    return (
      <View style={{ flex: 1, gap: 12, padding: 16 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </View>
    );
  }

  if (postQuery.isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text style={{ marginBottom: 16, color: theme.mutedForeground }}>
          Failed to load posts
        </Text>
        <Button onPress={() => void postQuery.refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={postQuery.data}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ padding: 16, gap: 10 }}
        keyExtractor={(item) => item.id}
        refreshing={postQuery.isRefetching}
        onRefresh={() =>
          void queryClient.invalidateQueries({
            queryKey: trpc.post.all.queryKey(),
          })
        }
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 40,
            }}
          >
            <Text style={{ color: theme.mutedForeground }}>
              No posts yet. Tap + to create one!
            </Text>
          </View>
        }
      />
      <CreatePostSheet />
    </>
  );
}
