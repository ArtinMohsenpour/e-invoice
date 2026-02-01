import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 3600, // 8 hours
    cookies: {
      domain: process.env.COOKIE_DOMAIN,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
    verify: false,
    forgotPassword: {
      generateEmailHTML: (args?: any) => {
        const { token, user } = args || {};
        const serverURL =
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
        const resetLink = `${serverURL}/reset-password?token=${token}`;

        return `
          <!doctype html>
          <html>
            <body>
              <h1>Reset your password</h1>
              <p>Hello ${user?.email},</p>
              <p>Click the link below to reset your password:</p>
              <p><a href="${resetLink}">${resetLink}</a></p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            </body>
          </html>
        `;
      },
    },
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "orgRole", "organization"],
  },
  access: {
    // Only 'admin' role can access the CMS /admin directory
    admin: ({ req: { user } }) => user?.role === 'admin',
    
    // Users can read themselves
    read: ({ req: { user } }) => {
      if (user?.role === "admin") return true;
      if (!user) return false;
      return { id: { equals: user.id } };
    },
    update: ({ req: { user } }) => {
      if (user?.role === "admin") return true;
      if (!user) return false;
      return { id: { equals: user.id } };
    },
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity & Access",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "role",
                  type: "select",
                  required: true,
                  defaultValue: "user",
                  options: [
                    { label: "Admin", value: "admin" },
                    { label: "User", value: "user" },
                  ],
                  access: {
                    update: ({ req: { user } }) => user?.role === "admin",
                  },
                },
                {
                   name: 'orgRole',
                   type: 'select',
                   options: [
                     { label: 'Owner', value: 'owner' },
                     { label: 'Manager', value: 'manager' },
                     { label: 'Accountant', value: 'accountant' },
                   ],
                   access: {
                     update: ({ req: { user } }) => user?.role === "admin",
                   },
                },
              ],
            },
            {
              name: 'organization',
              type: 'relationship',
              relationTo: 'organizations',
              index: true,
              admin: {
                position: 'sidebar',
              },
              access: {
                update: ({ req: { user } }) => user?.role === "admin",
              },
            },
            {
              type: "row",
              fields: [
                {
                  name: "active",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description: "Disable user access without deleting",
                  },
                },
                {
                  name: "lastLogin",
                  type: "date",
                  admin: {
                    position: "sidebar",
                    date: {
                      pickerAppearance: "dayAndTime",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Profile",
          fields: [
            {
              type: "row",
              fields: [
                { name: "firstName", type: "text" },
                { name: "lastName", type: "text" },
              ],
            },
            { name: "phoneNumber", type: "text" },
            {
              type: "row",
              fields: [
                {
                  name: "avatar",
                  type: "upload",
                  relationTo: "media",
                },
                {
                  name: "language",
                  type: "select",
                  defaultValue: "en",
                  options: [
                    { label: "English", value: "en" },
                    { label: "German", value: "de" },
                  ],
                },
                {
                  name: "theme",
                  type: "select",
                  defaultValue: "system",
                  options: [
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};