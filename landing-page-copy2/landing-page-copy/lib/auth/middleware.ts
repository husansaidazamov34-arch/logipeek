import { NextRequest, NextResponse } from 'next/server'
import { auth } from './config'
import { UserRole } from '@/lib/models/User'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    phone: string
    role: UserRole
  }
}

export async function requireAuth(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  const session = await auth()

  if (!session || !session.user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return {
    user: session.user,
    error: null,
  }
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  const authResult = await requireAuth(request)

  if (authResult.error) {
    return authResult
  }

  const userRole = (authResult.user as any).role

  if (!allowedRoles.includes(userRole)) {
    return {
      user: null,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  return authResult
}

export async function requireAdmin(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  return requireRole(request, ['admin'])
}

export async function requireShipper(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  return requireRole(request, ['shipper', 'admin'])
}

export async function requireDriver(
  request: NextRequest
): Promise<{ user: any; error: null } | { user: null; error: NextResponse }> {
  return requireRole(request, ['driver', 'admin'])
}

