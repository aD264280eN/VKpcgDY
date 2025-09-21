// 代码生成时间: 2025-09-21 18:00:17
import { PrismaClient } from '@prisma/client';

// Ensure the PrismaClient is imported and instantiated
const prisma = new PrismaClient();

class AuditLogService {
  // Method to create an audit log entry
  async createAuditLogEntry(userId: number, action: string, details: string): Promise<void> {
    try {
      // Attempt to create a new audit log entry
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          details,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      // Handle any errors that occur during the creation of the audit log entry
      console.error('Error creating audit log entry:', error);
      throw error;
    }
  }

  // Method to retrieve audit log entries
  async getAuditLogsForUser(userId: number): Promise<Prisma.AuditLog[]> {
    try {
      // Attempt to retrieve audit logs for the specified user
      return await prisma.auditLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
      });
    } catch (error) {
      // Handle any errors that occur during the retrieval of audit logs
      console.error('Error retrieving audit logs for user:', error);
      throw error;
    }
  }
}

// Export the AuditLogService class
export { AuditLogService };
