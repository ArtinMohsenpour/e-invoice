import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: true,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'plan', 'active'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (!user) return false
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity & Access',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'role',
                  type: 'select',
                  required: true,
                  defaultValue: 'user',
                  options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'User', value: 'user' },
                  ],
                  access: {
                    update: ({ req: { user } }) => user?.role === 'admin',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { description: 'Disable user access without deleting' },
                },
              ],
            },
          ],
        },
        {
          label: 'Subscription',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'plan',
                  type: 'select',
                  required: true,
                  defaultValue: 'basic',
                  options: [
                    { label: 'Basic', value: 'basic' },
                    { label: 'Pro', value: 'pro' },
                    { label: 'Enterprise', value: 'enterprise' },
                  ],
                },
                {
                  name: 'subscriptionStatus',
                  type: 'select',
                  defaultValue: 'trialing',
                  options: [
                    { label: 'Trialing', value: 'trialing' },
                    { label: 'Active', value: 'active' },
                    { label: 'Past Due', value: 'past_due' },
                    { label: 'Canceled', value: 'canceled' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'paid',
                  type: 'number',
                  admin: { description: 'Total paid amount' },
                },
                {
                  name: 'due',
                  type: 'date',
                  admin: { description: 'Next billing date' },
                },
              ],
            },
          ],
        },
        {
          label: 'Profile',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text' },
                { name: 'lastName', type: 'text' },
              ],
            },
            { name: 'companyName', type: 'text' },
            { name: 'phoneNumber', type: 'text' },
          ],
        },
      ],
    },
  ],
}
