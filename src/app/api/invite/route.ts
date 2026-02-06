import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/app/[locale]/(frontend)/actions/auth'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const user = await getMeUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.orgRole !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Only owners can invite members' }, { status: 403 })
    }

    const { email, orgRole } = await req.json()

    if (!email || !orgRole) {
      return NextResponse.json({ error: 'Email and Role are required' }, { status: 400 })
    }

    if (!['manager', 'accountant'].includes(orgRole)) {
       return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Check if user already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (existingUsers.totalDocs > 0) {
      // For this MVP, we disallow inviting existing users to a NEW org if they are already in one.
      // Or we just show error "User already registered".
      // The requirements say "User is already in the team (show error)"
      // Let's check if they are in THIS team.
      const existingUser = existingUsers.docs[0]
      const orgId = typeof user.organization === 'object' ? user.organization?.id : user.organization
      const existingUserOrgId = typeof existingUser.organization === 'object' ? existingUser.organization?.id : existingUser.organization

      if (orgId === existingUserOrgId) {
         return NextResponse.json({ error: 'User is already in the team' }, { status: 409 })
      }
      
      // If user exists but in different org or no org, we might handle differently, but for simplicity let's say "User already exists"
      return NextResponse.json({ error: 'User with this email already exists in the system' }, { status: 409 })
    }

    // Check for pending invitations
    const existingInvites = await payload.find({
       collection: 'invitations',
       where: {
          and: [
             { email: { equals: email } },
             { 'organization.id': { equals: typeof user.organization === 'object' ? user.organization?.id : user.organization } },
             { status: { equals: 'pending' } }
          ]
       }
    })

    if (existingInvites.totalDocs > 0) {
       return NextResponse.json({ error: 'Pending invitation already exists for this email' }, { status: 409 })
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48) // 48 hours

    const invitation = await payload.create({
      collection: 'invitations',
      data: {
        email,
        orgRole,
        organization: typeof user.organization === 'object' ? user.organization?.id : user.organization as any,
        token,
        status: 'pending',
        expiresAt: expiresAt.toISOString(),
        invitedBy: user.id,
      },
    })

    // Mock Email Sending
    console.log(`[Mock Email] Sending invite to ${email} with token ${token}`)
    
    // In a real app:
    // await sendEmail({ to: email, subject: 'Join the team', html: `.../signup?token=${token}` })

    return NextResponse.json({ success: true, message: 'Invitation sent', invitation })

  } catch (error) {
    console.error('Invite Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
