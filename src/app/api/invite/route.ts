import { getPayload } from "payload";
import configPromise from "@payload-config";
import { getMeUser } from "@/app/[locale]/(frontend)/actions/auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const user = await getMeUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.orgRole !== "owner") {
      return NextResponse.json(
        { error: "Forbidden: Only owners can invite members" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const email = body.email?.toLowerCase();
    const { orgRole } = body;

    if (!email || !orgRole) {
      return NextResponse.json(
        { error: "Email and Role are required" },
        { status: 400 },
      );
    }

    if (!["manager", "accountant"].includes(orgRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    const currentOrgId =
      typeof user.organization === "object"
        ? user.organization?.id
        : user.organization;

    let userExists = false;

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUsers.totalDocs > 0) {
      const existingUser = existingUsers.docs[0];
      const existingUserOrgId =
        typeof existingUser.organization === "object"
          ? existingUser.organization?.id
          : existingUser.organization;

      // If user is already in THIS organization, block them.
      if (currentOrgId === existingUserOrgId) {
        return NextResponse.json(
          { error: "User is already in the team" },
          { status: 409 },
        );
      }

      userExists = true;
    }

    // Check for pending invitations
    const existingInvites = await payload.find({
      collection: "invitations",
      where: {
        and: [
          { email: { equals: email } },
          { "organization.id": { equals: currentOrgId } },
          { status: { equals: "pending" } },
        ],
      },
    });

    if (existingInvites.totalDocs > 0) {
      return NextResponse.json(
        { error: "Pending invitation already exists for this email" },
        { status: 409 },
      );
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // 48 hours

    const invitation = await payload.create({
      collection: "invitations",
      data: {
        email,
        orgRole,
        organization: currentOrgId as any,
        token,
        status: "pending",
        expiresAt: expiresAt.toISOString(),
        invitedBy: user.id,
      },
    });

    // Prepare Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY env var");
      throw new Error("Server configuration error: Missing email provider key");
    }

    const resend = new Resend(resendApiKey);
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
    const inviteLink = `${baseUrl}/${userExists ? "login" : "signup"}?token=${token}`;
    const fromEmail = "onboarding@resend.dev";

    // HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>You're invited!</title>
          <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
              .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
              .header { background-color: #ffffff; padding: 32px; text-align: center; border-bottom: 1px solid #f3f4f6; }
              .content { padding: 32px; text-align: center; }
              .button { display: inline-block; background-color: #000000; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; margin-top: 24px; }
              .footer { padding: 24px; text-align: center; font-size: 12px; color: #6b7280; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
              .role-badge { display: inline-block; background-color: #f3f4f6; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500; color: #374151; margin-top: 8px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 style="margin:0; font-size: 24px; font-weight: 700;">Join the Team</h1>
              </div>
              <div class="content">
                  <p style="margin-bottom: 16px; font-size: 16px;">Hello,</p>
                  <p style="margin-bottom: 16px; font-size: 16px;">You have been invited to join an organization on our platform.</p>
                  
                  <div style="margin: 24px 0;">
                      <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Role:</p>
                      <span class="role-badge">${orgRole.charAt(0).toUpperCase() + orgRole.slice(1)}</span>
                  </div>

                  <a href="${inviteLink}" class="button">${userExists ? "Log in to Accept" : "Sign up to Accept"}</a>
                  
                  <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">
                      If you did not expect this invitation, you can safely ignore this email.
                  </p>
              </div>
              <div class="footer">
                  <p>This invitation link expires in 48 hours.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send Email via Resend
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "You have been invited to join the team",
      html: htmlTemplate,
    });

    if (sendError) {
      console.error("Resend Error:", sendError);
      throw new Error(`Failed to send email: ${sendError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent",
      invitation,
    });
  } catch (error: any) {
    console.error("Invite Error:", error);
    const message = error.message || "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
