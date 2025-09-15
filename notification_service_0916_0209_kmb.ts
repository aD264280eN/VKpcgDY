// 代码生成时间: 2025-09-16 02:09:51
import { PrismaClient } from '@prisma/client';

// Define a custom error class for notification-specific errors.
class NotificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotificationError';
  }
}

// The NotificationService class encapsulates the logic for sending notifications.
class NotificationService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    // Initialize the Prisma client.
    this.prisma = prisma;
  }

  // Send a notification to a user.
  async sendNotification(userId: number, message: string): Promise<void> {
    try {
      // Use the Prisma client to send a notification to the specified user.
      await this.prisma.notification.create({
        data: {
          userId: userId,
          content: message,
        },
      });
    } catch (error) {
      // Handle any errors that occur during the send operation.
      throw new NotificationError('Failed to send notification: ' + error.message);
    }
  }

  // Get all notifications for a user.
  async getNotificationsByUser(userId: number): Promise<any[]> {
    try {
      // Retrieve all notifications for the specified user.
      return await this.prisma.notification.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      // Handle any errors that occur during the retrieval operation.
      throw new NotificationError('Failed to retrieve notifications: ' + error.message);
    }
  }
}

// Export the NotificationService class for use in other parts of the application.
export { NotificationService, NotificationError };
