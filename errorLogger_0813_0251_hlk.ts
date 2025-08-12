// 代码生成时间: 2025-08-13 02:51:23
import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Define the ErrorLog model interface based on the database schema
interface ErrorLog {
  id: number;
  message: string;
  stackTrace: string;
  timestamp: Date;
}

// Define the ErrorLogger class
class ErrorLogger {

  // Method to log errors
  static async logError(message: string, stackTrace: string): Promise<void> {
    try {
      // Create an ErrorLog object
      const errorLog: ErrorLog = {
        message,
        stackTrace,
        timestamp: new Date()
      };
      
      // Save the error log to the database
      await prisma.errorLog.create({
        data: errorLog
      });

      console.log('Error logged successfully.');
    } catch (error) {
      // Handle any errors that occur during logging
      console.error('Error logging failed:', error);
    }
  }
}

// Export the ErrorLogger class
export default ErrorLogger;