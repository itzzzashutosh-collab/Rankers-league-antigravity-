import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const avatarService = {
  // Upload avatar to Supabase Storage
  async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ url: string | null; error: string | null }> {
    if (file.size > MAX_FILE_SIZE) {
      return { url: null, error: "File size must be under 2MB." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return { url: null, error: "Only JPG, PNG and WebP images are allowed." };
    }

    const supabase = await createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(storagePath, file, { upsert: true, contentType: file.type });

    if (uploadError) return { url: null, error: uploadError.message };

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    // Update profile avatar_url
    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    // Record in avatars table
    const admin = createAdminClient();
    await admin.from("avatars").insert({
      user_id: userId,
      storage_path: storagePath,
      original_filename: file.name,
      file_size_bytes: file.size,
      is_active: true,
    });

    return { url: publicUrl, error: null };
  },

  // Remove avatar and reset to null
  async removeAvatar(userId: string): Promise<{ error: string | null }> {
    const supabase = await createClient();

    // List and remove files in user folder
    const { data: files } = await supabase.storage
      .from(AVATAR_BUCKET)
      .list(userId);

    if (files && files.length > 0) {
      const paths = files.map((f) => `${userId}/${f.name}`);
      await supabase.storage.from(AVATAR_BUCKET).remove(paths);
    }

    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", userId);

    if (error) return { error: error.message };
    return { error: null };
  },
};
