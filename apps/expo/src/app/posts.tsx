import React, { useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Link, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import initials from "initials";
import { toast } from "sonner-native";

import type { RouterOutputs } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useTRPC } from "~/utils/api";

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
  const fallback = initials(name || email || "").slice(0, 2) || "?";

  if (image && !imgError) {
    return (
      <Image
        className="mr-2 h-10 w-10 self-center rounded-full bg-muted"
        alt={`${name}'s avatar`}
        source={{ uri: image }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <View className="mr-2 h-10 w-10 items-center justify-center self-center rounded-full bg-muted">
      <Text className="text-sm font-medium text-muted-foreground">
        {fallback}
      </Text>
    </View>
  );
}

function PostCard(props: { post: RouterOutputs["post"]["all"][number] }) {
  const { post } = props;

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useMutation(
    trpc.post.delete.mutationOptions({
      onSuccess: async () => {
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

  return (
    <View className="mx-2 flex flex-row rounded-lg bg-muted p-4">
      <View className="flex-grow">
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: props.post.id },
          }}
          className="flex flex-row items-start"
        >
          <Pressable>
            <PostAuthorAvatar
              image={post.author.image}
              name={post.author.name}
              email={post.author.email}
            />
            <View>
              <Text className="text-xl font-semibold">{post.title}</Text>
              <Text className="mt-2 text-foreground">{post.content}</Text>
            </View>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={() => deletePost(post.id)}>
        <Text className="font-bold uppercase">Delete</Text>
      </Pressable>
    </View>
  );
}

function CreatePost() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const { mutate: createPost, error } = useMutation(
    trpc.post.create.mutationOptions({
      onSuccess: async () => {
        setTitle("");
        setContent("");
        Keyboard.dismiss();
        await queryClient.invalidateQueries({
          queryKey: trpc.post.all.queryKey(),
        });
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={150}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} className="flex-1">
        <View className="mt-4 justify-around gap-4">
          <Input
            placeholderTextColor="#A1A1A9" // zinc-400
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
          />
          {error?.data?.zodError?.fieldErrors.title && (
            <Text className="mb-2 text-red-500">
              {error.data.zodError.fieldErrors.title}
            </Text>
          )}
          <Input
            placeholderTextColor="#A1A1A9" // zinc-400
            value={content}
            onChangeText={setContent}
            placeholder="Content"
          />
          {error?.data?.zodError?.fieldErrors.content && (
            <Text className="mb-2 text-destructive">
              {error.data.zodError.fieldErrors.content}
            </Text>
          )}
          <Button
            onPress={() => {
              createPost({
                title,
                content,
              });
            }}
          >
            <Text className="font-semibold">Create</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default function HomeScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const postQuery = useQuery(trpc.post.all.queryOptions());

  return (
    <View className="h-full w-full bg-background p-4">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className="text-xl font-bold text-primary">Posts</Text>
          ),
        }}
      />
      <Button
        className="my-4"
        onPress={() =>
          void queryClient.invalidateQueries({
            queryKey: trpc.post.all.queryKey(),
          })
        }
      >
        <Text>Refresh posts</Text>
      </Button>
      <View className="py-2">
        <Text className="font-semibold italic">Press on a post</Text>
      </View>

      <FlashList
        data={postQuery.data}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={(p) => <PostCard post={p.item} />}
      />

      <CreatePost />
    </View>
  );
}
