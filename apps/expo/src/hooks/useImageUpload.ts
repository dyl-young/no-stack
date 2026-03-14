import { useState } from "react";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner-native";

import { FilePrivacy, uploadImageFile } from "@no-stack/files";

import { useTRPC } from "~/utils/api";
import { supabase } from "~/utils/supabase";

export const useImageUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Get API mutations
  const trpc = useTRPC();
  const createPublicImageMutation = useMutation(
    trpc.files.createPublicImage.mutationOptions(),
  );
  const createPrivateImageMutation = useMutation(
    trpc.files.createPrivateImage.mutationOptions(),
  );

  const pickImage = async (source: "gallery" | "camera") => {
    const permissionFn =
      source === "gallery"
        ? ImagePicker.requestMediaLibraryPermissionsAsync
        : ImagePicker.requestCameraPermissionsAsync;

    const { status } = await permissionFn();
    if (status !== "granted") {
      setError(`Permission to access ${source} is required!`);
      return;
    }

    const launchFn =
      source === "gallery"
        ? ImagePicker.launchImageLibraryAsync
        : ImagePicker.launchCameraAsync;

    const result = await launchFn({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
      setError(null);
    }
  };

  const uploadImage = async (uploadType: FilePrivacy) => {
    if (!image) return;

    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const response = await fetch(image);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = image.split(".").pop();
      const fileName = `${Crypto.randomUUID()}.${fileExt}`;

      // Upload to storage
      const result = await uploadImageFile(
        supabase,
        arrayBuffer,
        fileName,
        uploadType,
      );

      // Create record in database through API
      if (uploadType === "public" && result.publicUrl) {
        await createPublicImageMutation.mutateAsync({
          publicUrl: result.publicUrl,
          path: result.path,
        });
      } else if (uploadType === "private") {
        await createPrivateImageMutation.mutateAsync({
          path: result.path,
        });
      }

      clearInterval(progressInterval);
      setProgress(100);

      setImage(null);
      toast.success("Image uploaded successfully!");
      return true;
    } catch (error) {
      console.log(`Error uploading ${uploadType} image`, error);
      setError((error as Error).message);
      toast.error((error as Error).message);
      return false;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    image,
    setImage,
    uploading,
    error,
    progress,
    pickImage,
    uploadImage,
  };
};
