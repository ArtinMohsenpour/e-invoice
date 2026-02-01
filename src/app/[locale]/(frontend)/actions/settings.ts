"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserPreferences(userId: number, data: { theme?: 'light' | 'dark' | 'system', language?: 'en' | 'de' }) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const headersList = await headers();

  try {
    // Verify authentication
    const { user } = await payload.auth({ headers: headersList });
    
    if (!user || user.id !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await payload.update({
      collection: "users",
      id: userId,
      data: {
        theme: data.theme,
        language: data.language,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}
