import type { CollectionConfig } from 'payload'

export const CreditTransactions: CollectionConfig = {
  slug: 'credit-transactions',
  admin: {
    defaultColumns: ['created_at', 'organization', 'amount', 'type'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true

      return {
        organization: {
          equals: typeof user.organization === 'object' ? user.organization?.id : user.organization,
        },
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
      index: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Generation', value: 'generation' },
        { label: 'Top-up', value: 'topup' },
        { label: 'Refund', value: 'refund' },
      ],
    },
    {
      name: 'description',
      type: 'text',
    },
  ],
}
