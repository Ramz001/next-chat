import { auth } from './auth'
import { Role } from '@shared/prisma/generated/enums'
import { Session } from 'next-auth'

/**
 * Throws if the user is not authenticated
 */
export async function requireAuth(): Promise<Session['user']> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  return session.user
}

/**
 * Throws if the user is not authenticated or not an admin
 */
export async function requireAdmin(): Promise<Session['user']> {
  const user = await requireAuth()

  if (user.role !== Role.ADMIN) {
    throw new Error('Forbidden')
  }

  return user
}
