import type { CollectionConfig } from 'payload'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      return {
        id: {
          equals: typeof user.organization === 'object' ? user.organization?.id : user.organization,
        },
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      // ONLY Owner can update their own org
      if (user.orgRole === 'owner') {
        return {
          id: {
            equals: typeof user.organization === 'object' ? user.organization?.id : user.organization,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      // ONLY Owner can delete
      if (user.orgRole === 'owner') {
        return {
          id: {
            equals: typeof user.organization === 'object' ? user.organization?.id : user.organization,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
       // Usually users create an org on signup or admin creates it.
       // Allowing any authenticated user to create ONE org if they don't have one?
       // For now, let's restricted creation to admin or maybe allow it for initial flow?
       // Prompt doesn't specify creation logic, assuming Admin or specialized flow.
       // I'll allow admin only for now to be safe, or perhaps any user who is 'owner' (but they need org first?)
       if (user?.role === 'admin') return true
       return true // allow creation for now, might be needed for onboarding
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'taxId',
      type: 'text',
      label: 'VAT / Tax ID',
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Business Phone',
    },
    {
      type: 'group',
      name: 'address',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'street', type: 'text' },
            { name: 'city', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'zip', type: 'text' },
            { name: 'country', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'plan',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Basic', value: 'basic' },
        { label: 'Pro', value: 'pro' },
        { label: 'Ultimate', value: 'ultimate' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
    {
      name: 'creditsRemaining',
      type: 'number',
      defaultValue: 0,
      min: 0,
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
