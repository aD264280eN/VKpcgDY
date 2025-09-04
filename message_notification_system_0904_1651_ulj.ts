// 代码生成时间: 2025-09-04 16:51:30
 * maintainability and scalability.
 */

// Import the Prisma client
import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Define an interface for the Notification
interface Notification {
  id: string;
  message: string;
  createdAt: Date;
}

// Define the NotificationService class
class NotificationService {
  // Method to create a new notification
  async createNotification(message: string): Promise<Notification> {
    try {
      // Use the Prisma client to create a new notification in the database
      const newNotification = await prisma.notification.create({
        data: {
          message,
          createdAt: new Date(),
        },
      });

      // Return the created notification
      return newNotification;
    } catch (error) {
      // Handle any errors that occur during notification creation
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Method to retrieve all notifications
  async getAllNotifications(): Promise<Notification[]> {
    try {
      // Use the Prisma client to retrieve all notifications from the database
      const notifications = await prisma.notification.findMany();

      // Return the list of notifications
      return notifications;
    } catch (error) {
      // Handle any errors that occur during notification retrieval
      console.error('Error retrieving notifications:', error);
      throw error;
    }
  }
}

// Example usage of the NotificationService
(async () => {
  const notificationService = new NotificationService();

  // Create a new notification
  const newNotification = await notificationService.createNotification('Hello World!');
  console.log('Created notification:', newNotification);

  // Retrieve all notifications
  const notifications = await notificationService.getAllNotifications();
  console.log('All notifications:', notifications);
})();