"use server";

import { cookies, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { LoginSchema, SignupSchema } from "@/lib/validators";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";

const COOKIE_NAME = 'payload-token';

export async function getMeUser() {
  const headersList = await headers();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers: headersList });
  return user;
}

export async function loginAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  
  const data = Object.fromEntries(formData);
  const result = LoginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    const { user, token } = await payload.login({
      collection: "users",
      data: {
        email: result.data.email,
        password: result.data.password,
      },
    });
    
    if (!user || !token) {
        return { success: false, error: "Invalid email or password", fields: data };
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax'
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Invalid email or password", fields: data };
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const data = Object.fromEntries(formData);
  const result = SignupSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    await payload.create({
      collection: "users",
      data: {
        email: result.data.email,
        password: result.data.password,
        companyName: result.data.companyName,
      } as any,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create account", fields: data };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  const locale = await getLocale();
  redirect({ href: "/login", locale });
}
