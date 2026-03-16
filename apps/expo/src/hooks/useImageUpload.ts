import { useState } from "react";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { toast } from "sonner-native";

import type { UploadImageResult } from "@no-stack/files";
import { uploadImage } from "@no-stack/files";

import { supabase } from "~/utils/supabase";

interface UseImageUploadConfig {
  bucket: string;
  getPath: (fileName: string) => string;
  onUploadComplete?: (publicUrl: string) => void;
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

export function useImageUpload(config: UseImageUploadConfig) {
  const {
    bucket,
    getPath,
    onUploadComplete,
    quality = 0.8,
    allowsEditing = true,
    aspect = [1, 1],
  } = config;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const pickAndUpload = async (source: "gallery" | "camera") => {
    try {
      // Request permission
      const permissionFn =
        source === "gallery"
          ? ImagePicker.requestMediaLibraryPermissionsAsync
          : ImagePicker.requestCameraPermissionsAsync;

      const { status } = await permissionFn();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        setError(`Permission to access ${source} is required!`);
        toast.error(`Permission to access ${source} is required!`);
        return;
      }

      // Pick image
      const launchFn =
        source === "gallery"
          ? ImagePicker.launchImageLibraryAsync
          : ImagePicker.launchCameraAsync;

      const result = await launchFn({
        mediaTypes: ["images"],
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets[0]) return;

      // Upload
      setUploading(true);
      setError(null);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const fileExt = uri.split(".").pop() ?? "jpg";
      const fileName = `${Crypto.randomUUID()}.${fileExt}`;
      const path = getPath(fileName);

      const uploadResult: UploadImageResult = await uploadImage(
        supabase,
        arrayBuffer,
        { bucket, path },
      );

      clearInterval(progressInterval);
      setProgress(100);

      toast.success("Image uploaded successfully!");
      onUploadComplete?.(uploadResult.publicUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Image upload error:", err);
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { pickAndUpload, uploading, error, progress };
}
