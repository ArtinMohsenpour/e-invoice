import { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      // Only allow admins to update the header
      // Adjust 'admin' to match your actual role value (e.g., 'admin' or check a roles array)
      // Assuming 'admin' role string for now based on standard patterns or User collection.
      // The prompt said "restricted to users with role: 'admin'".
      return user?.role === "admin";
    },
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "companyName",
      type: "text",
      localized: true,
    },
    {
      name: "navItems",
      type: "array",
      admin: {
        description: "Define the navigation items for the header",
      },
      fields: [
        {
          name: "label",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "type",
          type: "select",
          options: [
            {
              label: "Single Link",
              value: "single",
            },
            {
              label: "Dropdown Menu",
              value: "dropdown",
            },
          ],
          defaultValue: "single",
          required: true,
        },
        {
          name: "link",
          type: "text",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "single",
          },
        },
        {
          name: "subMenu",
          type: "array",
          admin: {
            condition: (_, siblingData) => siblingData?.type === "dropdown",
          },
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
            },
            {
              name: "url",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
