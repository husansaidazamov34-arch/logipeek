import { AuditLog, AuditAction, AuditEntity } from '@/lib/models/AuditLog'
import connectDB from '@/lib/db/mongodb'

export async function createAuditLog(
  userId: string,
  entityType: AuditEntity,
  entityId: string,
  action: AuditAction,
  changes?: { field: string; oldValue: any; newValue: any }[],
  metadata?: Record<string, any>
) {
  await connectDB()

  await AuditLog.create({
    userId,
    entityType,
    entityId,
    action,
    changes,
    metadata,
  })
}

