import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/app/[locale]/(frontend)/actions/auth'
import { redirect } from 'next/navigation'
import { User } from '@/payload-types'

export async function getTeamData() {
  const user = await getMeUser()

  if (!user) {
    return { user: null, members: [], invitations: [] }
  }

  const payload = await getPayload({ config: configPromise })

  const orgId = typeof user.organization === 'object' ? user.organization?.id : user.organization

  if (!orgId) {
     // User has no organization, so no team.
     return { user, members: [user], invitations: [] }
  }

  // Fetch Team Members
  const membersResult = await payload.find({
    collection: 'users',
    where: {
      'organization.id': {
        equals: orgId,
      },
    },
    limit: 100, // Reasonable limit for MVP
  })

  // Fetch Pending Invitations
  const invitationsResult = await payload.find({
    collection: 'invitations',
    where: {
      and: [
        { 'organization.id': { equals: orgId } },
        { status: { equals: 'pending' } }
      ]
    },
    limit: 50,
  })

  return {
    user,
    members: membersResult.docs,
    invitations: invitationsResult.docs,
  }
}
