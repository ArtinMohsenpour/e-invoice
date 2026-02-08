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

// Helper to handle invitation acceptance
async function acceptInvitation(payload: any, userId: number | string, token: string | null) {
  if (!token) return;

  try {
    const invites = await payload.find({
      collection: 'invitations',
      where: {
        token: { equals: token },
        status: { equals: 'pending' },
        expiresAt: { greater_than: new Date().toISOString() }
      }
    });

    if (invites.totalDocs > 0) {
      const invite = invites.docs[0];
      const orgId = typeof invite.organization === 'object' ? invite.organization.id : invite.organization;

      // Update User
      await payload.update({
        collection: 'users',
        id: userId,
        data: {
          organization: orgId,
          orgRole: invite.orgRole,
        }
      });

      // Update Invitation
      await payload.update({
        collection: 'invitations',
        id: invite.id,
        data: {
          status: 'accepted'
        }
      });
      
      console.log(`[Auth] User ${userId} accepted invitation ${invite.id} via token`);
    }
  } catch (error) {
    console.error("[Auth] Failed to process invitation token:", error);
    // Continue without failing the auth process, just log error
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const data = Object.fromEntries(formData);
  const token = data.token as string | null; // Extract token
  const result = LoginSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    const { user, token: sessionToken } = await payload.login({
      collection: "users",
      data: {
        email: result.data.email,
        password: result.data.password,
      },
    });

    if (!user || !sessionToken) {
      return {
        success: false,
        error: "Invalid email or password",
        fields: data,
      };
    }

    // Process Invitation if token exists
    if (token) {
       await acceptInvitation(payload, user.id, token);
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600, // 8 hours
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
    });

    // If invite processed, fetch updated user for return state? 
    // Usually state.user is just for client immediate feedback, but let's be safe.
    // The redirect usually happens anyway.
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Invalid email or password", fields: data };
  }
}

export async function signupAction(prevState: any, formData: FormData) {
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });

  const data = Object.fromEntries(formData);
  const token = data.token as string | null; // Extract token
  const result = SignupSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
      fields: data,
    };
  }

  try {
    const user = await payload.create({
      collection: "users",
      data: {
        email: result.data.email,
        password: result.data.password,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
      } as any,
    });

    // Process Invitation if token exists
    if (token && user) {
       await acceptInvitation(payload, user.id, token);
    }

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
    console.error("Forgot password error:", error);
    return { success: true }; 
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