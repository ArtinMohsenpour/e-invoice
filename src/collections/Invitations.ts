import type { CollectionConfig } from 'payload'

export const Invitations: CollectionConfig = {
  slug: 'invitations',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: ({ req: { user } }) => {
       // Only allow creation via API or Admin for now to control the flow
       return user?.role === 'admin'
    },
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Users can see invites for their org
      return {
        'organization.id': {
           equals: typeof user.organization === 'object' ? user.organization?.id : user.organization
        }
      }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return false // Invites are mostly immutable or handled by system
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      
      // Owners can cancel invites
      if (user.orgRole === 'owner') {
         return {
            'organization.id': {
               equals: typeof user.organization === 'object' ? user.organization?.id : user.organization
            }
         }
      }
      return false
    }
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'orgRole',
      type: 'select',
      required: true,
      options: [
        { label: 'Manager', value: 'manager' },
        { label: 'Accountant', value: 'accountant' },
      ],
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        hidden: true, // Hide from admin UI for security
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'invitedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
