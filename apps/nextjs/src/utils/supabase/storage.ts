import { createClient } from "@/utils/supabase/client";

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  await supabase.storage.from("avatars").upload(filePath, file);

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
