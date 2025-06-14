
import { supabase } from "@/integrations/supabase/client";

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const bucket = "avatars";
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}.${fileExt}`;

  // Remove existing file if any (replace)
  await supabase.storage.from(bucket).remove([filePath]);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError.message);
    return null;
  }

  // Get public URL for display
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl || null;
}
