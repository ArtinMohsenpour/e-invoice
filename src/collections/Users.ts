import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: false,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "plan", "active"],
  },
  access: {
    read: ({ req: { user } }) => {
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
                  name: "active",
                  type: "checkbox",
                  defaultValue: true,
                  admin: {
                    description: "Disable user access without deleting",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
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
                {
                  name: "onboardingComplete",
                  type: "checkbox",
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: "Subscription",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "plan",
                  type: "select",
                  required: true,
                  defaultValue: "basic",
                  options: [
                    { label: "Basic", value: "basic" },
                    { label: "Pro", value: "pro" },
                    { label: "Enterprise", value: "enterprise" },
                  ],
                },
                {
                  name: "subscriptionStatus",
                  type: "select",
                  defaultValue: "trialing",
                  options: [
                    { label: "Trialing", value: "trialing" },
                    { label: "Active", value: "active" },
                    { label: "Past Due", value: "past_due" },
                    { label: "Canceled", value: "canceled" },
                  ],
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "paid",
                  type: "number",
                  admin: { description: "Total paid amount" },
                },
                {
                  name: "due",
                  type: "date",
                  admin: { description: "Next billing date" },
                },
              ],
            },
            {
              name: "stripeCustomerId",
              type: "text",
              admin: {
                position: "sidebar",
              },
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
            { name: "companyName", type: "text" },
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
                  defaultValue: "de",
                  options: [
                    { label: "English", value: "en" },
                    { label: "German", value: "de" },
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
