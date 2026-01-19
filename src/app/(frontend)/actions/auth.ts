"use server";

import { cookies } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { LoginSchema } from "@/lib/validators";
import type { User } from "@/payload-types";
import { redirect } from "next/navigation";

export type ActionState = {
  success: boolean;
  error?: string | Record<string, string[]> | null;
  user?: User | null;
  fields?: {
    email?: string;
    password?: string;
  };
};

// Payload 3.0 uses slug-based cookie names by default: payload-{slug}-token
const COOKIE_NAME = "payload-users-token";

/**
 * Server-side helper to get the current user from the session cookie.
 * Use this in Layouts or Server Components to prevent "flicker" on refresh.
 */
export async function getMeUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = await getPayload({ config });
    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: `JWT ${token}`,
      }),
    });

    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Handles user login via Payload Local API and sets the persistence cookie.
 */
export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const payload = await getPayload({ config });

  const rawData = Object.fromEntries(formData.entries());
  const emailInput = rawData.email as string;
  const passwordInput = rawData.password as string;

  // 1. Server-side validation
  const validatedFields = LoginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors as unknown as Record<
        string,
        string[]
      >,
      user: null,
      fields: {
        email: emailInput,
        password: passwordInput,
      },
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Perform Login via Local API
    const { token, user } = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (!token || !user) {
      return {
        success: false,
        error: "Invalid email or password.",
        user: null,
        fields: { email, password },
      };
    }

    // 3. Set Persistent Cookie manually (required when using Local API in Server Actions)
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user, error: null };
  } catch (error: any) {
    const message = error?.message || "Invalid email or password.";

    // Handle specific verification or lock-out errors from Payload
    if (message.toLowerCase().includes("verified") || error.status === 403) {
      return {
        success: false,
        error: "Please verify your email address before logging in.",
        user: null,
        fields: { email, password },
      };
    }

    return {
      success: false,
      error: "Invalid email or password.",
      user: null,
      fields: { email, password },
    };
  }
}

/**
 * Handles user registration and auto-login.
 */
export async function signupAction(_prevState: any, formData: FormData) {
  const payload = await getPayload({ config });
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  try {
    // Create the user
    await payload.create({
      collection: "users",
      data: {
        email,
        password,
        firstName,
        lastName,
        role: "user",
        plan: "basic",
      },
    });

    // Perform auto-login to generate a session token
    const { token } = await payload.login({
      collection: "users",
      data: { email, password },
    });

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, token, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  } catch (error) {
    return {
      success: false,
      error: "Email already exists or registration failed.",
    };
  }

  // Redirect to dashboard after successful signup and login
  redirect("/dashboard");
}

/**
 * Handles logout by clearing the persistent cookie.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  // Ensure we redirect to the login page to clear protected states
  redirect("/login");
}
