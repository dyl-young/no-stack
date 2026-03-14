import type { SupabaseClient } from "@supabase/supabase-js";

type FileBody =
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | ReadableStream<Uint8Array>;
export type FilePrivacy = "public" | "private";

export interface ImageUploadResult {
  path: string;
  userId: string;
  privacy: FilePrivacy;
  publicUrl?: string;
}

export async function uploadImageFile(
  supabase: SupabaseClient,
  file: FileBody,
  fileName: string,
  filePrivacy: FilePrivacy,
): Promise<ImageUploadResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const bucket = filePrivacy === "private" ? "private_images" : "public_images";
  const filePath =
    filePrivacy === "private" ? `${user.id}/${fileName}` : fileName;

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const result: ImageUploadResult = {
    path: data.path,
    userId: user.id,
    privacy: filePrivacy,
  };

  // If public, also get the public URL
  if (filePrivacy === "public") {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    result.publicUrl = publicUrl;
  }

  return result;
}
