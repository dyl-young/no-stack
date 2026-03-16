import type { SupabaseClient } from "@supabase/supabase-js";

type FileBody =
  | Blob
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | ReadableStream<Uint8Array>;

export interface UploadImageOptions {
  bucket: string;
  path: string;
  upsert?: boolean;
}

export interface UploadImageResult {
  path: string;
  publicUrl: string;
}

export async function uploadImage(
  supabase: SupabaseClient,
  file: FileBody,
  options: UploadImageOptions,
): Promise<UploadImageResult> {
  const { bucket, path, upsert = true } = options;

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { path: data.path, publicUrl };
}
