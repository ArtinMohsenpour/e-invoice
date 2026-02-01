"use server";

import { cookies, headers } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import {
  LoginSchema,
  SignupSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/validators";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/routing";

const COOKIE_NAME = "payload-token";

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
      return {
        success: false,
        error: "Invalid email or password",
        fields: data,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600, // 8 hours
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
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
        firstName: result.data.firstName,
        lastName: result.data.lastName,
      } as any,
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create account",
      fields: data,
    };
  }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const data = Object.fromEntries(formData);
  const result = ForgotPasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    await payload.forgotPassword({
      collection: "users",
      data: {
        email: result.data.email,
      },
      disableEmail: false,
    });

    return { success: true };
  } catch (error: any) {
    // We don't want to reveal if the email exists or not for security reasons
    // But for better UX in this template we might return success: true anyway
    // However, if there is a system error, we catch it.
    // If the user doesn't exist, payload might throw or just return token.
    console.error("Forgot password error:", error);
    return { success: true }; // Always return success to avoid enumeration attacks
  }
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const data = Object.fromEntries(formData);
  const token = data.token as string;
  const result = ResetPasswordSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    const { user, token: newToken } = await payload.resetPassword({
      collection: "users",
      data: {
        password: result.data.password,
        token: token,
      },
      overrideAccess: true,
    });

    // Automatically log in the user after reset?
    // Usually we redirect to login, or we can set the cookie here.
    // Let's set the cookie for seamless experience.
    if (user && newToken) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 3600, // 8 hours
        sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN,
      });
    }

    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to reset password",
      fields: data,
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  const locale = await getLocale();
  redirect({ href: "/login", locale });
}
