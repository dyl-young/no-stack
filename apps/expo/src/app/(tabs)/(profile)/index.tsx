import { useCallback, useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react-native";
import { toast } from "sonner-native";

import { GoogleIcon } from "~/components/google-icon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { UserAvatar } from "~/components/user-avatar";
import { useImageUpload } from "~/hooks/useImageUpload";
import { useThemeColours } from "~/lib/theme";
import { useTRPC } from "~/utils/api";
import { GoogleSignInCancelledError, signInWithGoogle } from "~/utils/auth";
import { useSupabaseClient, useUser } from "~/utils/session";

export default function ProfileScreen() {
  const user = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries(trpc.user.getUserProfile.queryFilter());
    setRefreshing(false);
  }, [queryClient, trpc]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => Keyboard.dismiss()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        {user ? <SignedInView /> : <SignedOutView />}
      </Pressable>
    </ScrollView>
  );
}

function SignedInView() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    ...trpc.user.getUserProfile.queryOptions(),
    enabled: !!user?.id,
  });

  const [name, setName] = useState("");
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

  // Sync local state when profile data loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
    }
  }, [userProfile]);

  const nameChanged = !!userProfile && name !== userProfile.name;
  const hasChanges = nameChanged || pendingImageUrl !== null;

  const updateProfile = useMutation(
    trpc.user.updateUserProfile.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries();
        toast.success("Profile updated.");
        setPendingImageUrl(null);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const { pickAndUpload, uploading } = useImageUpload({
    bucket: "avatars",
    getPath: (fileName) => `${user?.id}/${fileName}`,
    onUploadComplete: (publicUrl) => {
      setPendingImageUrl(publicUrl);
    },
  });

  const handleAvatarPress = () => {
    const options = ["Take Photo", "Choose from Library", "Cancel"];
    const cancelButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex },
        (buttonIndex) => {
          if (buttonIndex === 0) void pickAndUpload("camera");
          else if (buttonIndex === 1) void pickAndUpload("gallery");
        },
      );
    } else {
      Alert.alert("Change Avatar", undefined, [
        { text: "Take Photo", onPress: () => void pickAndUpload("camera") },
        {
          text: "Choose from Library",
          onPress: () => void pickAndUpload("gallery"),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleSave = () => {
    updateProfile.mutate({
      name,
      ...(pendingImageUrl ? { image: pendingImageUrl } : {}),
    });
  };

  // Show pending image as preview in the avatar
  const displayProfile = userProfile
    ? { ...userProfile, image: pendingImageUrl ?? userProfile.image }
    : undefined;

  return (
    <View className="gap-6">
      {userProfile && (
        <>
          {/* Avatar */}
          <View className="items-center gap-2">
            <Pressable onPress={handleAvatarPress} disabled={uploading}>
              <View>
                <UserAvatar userProfile={displayProfile} size="extra-large" />
                {uploading && (
                  <View className="absolute inset-0 items-center justify-center rounded-full bg-black/40">
                    <ActivityIndicator color="white" />
                  </View>
                )}
              </View>
            </Pressable>
            <Text className="text-xs text-muted-foreground">
              Tap photo to change
            </Text>
          </View>

          {/* Name */}
          <View className="gap-2">
            <Label nativeID="name">Full Name</Label>
            <Input
              aria-labelledby="name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Email (read-only) */}
          <View className="gap-2">
            <Label nativeID="email">Email</Label>
            <Input
              aria-labelledby="email"
              value={user?.email ?? ""}
              editable={false}
              className="text-muted-foreground opacity-60"
            />
          </View>

          {/* Save */}
          <Button
            onPress={handleSave}
            disabled={!hasChanges || updateProfile.isPending}
          >
            <Text>
              {updateProfile.isPending ? "Saving\u2026" : "Save Changes"}
            </Text>
          </Button>
        </>
      )}

      {!userProfile && (
        <Text className="text-muted-foreground">
          Signed in as {user?.email}
        </Text>
      )}

      <Button variant="secondary" onPress={() => supabase.auth.signOut()}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}

function SignedOutView() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      if (e instanceof GoogleSignInCancelledError) return;
      console.error("Google sign in failed:", e);
      const message = e instanceof Error ? e.message : "Something went wrong.";
      Alert.alert("Error", message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View className="gap-6">
      <Text className="text-2xl font-bold">Sign In</Text>

      <EmailForm />

      <View className="flex-row items-center gap-4">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-muted-foreground">or</Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <Button
        variant="secondary"
        onPress={handleGoogleSignIn}
        disabled={isSigningIn}
      >
        {isSigningIn ? (
          <ActivityIndicator />
        ) : (
          <View className="flex-row items-center gap-2">
            <GoogleIcon size={18} />
            <Text>Continue with Google</Text>
          </View>
        )}
      </Button>
    </View>
  );
}

function EmailForm() {
  const supabase = useSupabaseClient();
  const theme = useThemeColours();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const signInWithPassword = async () => {
    const { error, data } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert("Error", error.message);
    else if (isSignUp && data.user) {
      Alert.alert("Check your email for a confirmation link.");
      setIsSignUp(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="gap-4">
        <Input
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
        <View className="relative">
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholder="Password"
          />
          <Pressable
            className="absolute top-3 right-3"
            onPress={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <Eye size={20} color={theme.mutedForeground} />
            ) : (
              <EyeOff size={20} color={theme.mutedForeground} />
            )}
          </Pressable>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={() => setIsSignUp((prev) => !prev)}
        >
          <Text>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </Text>
        </Button>

        <Button onPress={signInWithPassword}>
          <Text>{isSignUp ? "Sign Up" : "Sign In"}</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
