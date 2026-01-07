"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema, forgotPasswordSchema } from "@/lib/validations/auth";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email");
  const validationResult = forgotPasswordSchema.safeParse({ email });

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    validationResult.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/auth/callback?next=/dashboard/settings`,
    }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the password reset link." };
}

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validationResult = loginSchema.safeParse(rawData);

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { email, password } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName"),
  };

  const validationResult = signupSchema.safeParse(rawData);

  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message };
  }

  const { email, password, companyName } = validationResult.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
