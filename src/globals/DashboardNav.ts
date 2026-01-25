import { GlobalConfig } from "payload";
import { revalidateTag } from "next/cache";

export const DashboardNav: GlobalConfig = {
  slug: "dashboard-nav",
  hooks: {
    afterChange: [
      () => {
        revalidateTag("global_dashboard-nav", {});
      },
    ],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => {
      return user?.role === "admin";
    },
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "label",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "link",
          type: "text",
          required: true,
        },
        {
          name: "icon",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
