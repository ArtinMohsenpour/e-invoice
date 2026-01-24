import { GlobalConfig } from "payload";
import { NavRowLabel } from "@/components/payload/NavRowLabel";
import { revalidateTag } from "next/cache";

export const Header: GlobalConfig = {
  slug: "header",
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidateTag("global_header", {});
        return doc;
      },
    ],
  },
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
        components: {
          // @ts-expect-error RowLabel is valid for ArrayField
          RowLabel: NavRowLabel,
        },
      },
      fields: [
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
          name: "label",
          type: "text",
          localized: true,
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
