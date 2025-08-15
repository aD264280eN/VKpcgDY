// 代码生成时间: 2025-08-15 22:13:30
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Define the error logging configuration
interface ErrorLoggerConfig {
  filePath: string;
}

// Error logger class
class ErrorLogger {
  private prisma: PrismaClient;
  private config: ErrorLoggerConfig;
  private logFile: string;

  constructor(prisma: PrismaClient, config: ErrorLoggerConfig) {
    this.prisma = prisma;
    this.config = config;
    this.logFile = path.join(config.filePath, 'error.log');
  }

  // Logs error information to the file system
  public logError(error: Error): void {
    try {
      // Attempt to write error information to the log file
      fs.appendFileSync(this.logFile, `${new Date().toISOString()}: ${error.message}
`, 'utf8');
    } catch (err) {
      // Handle file write errors
      console.error('Error writing to log file:', err);
    }
  }

  // Error handling middleware for Prisma
  public async prismaErrorHandler<T>(action: () => Promise<T>): Promise<T> {
    try {
      // Attempt to perform the Prisma action
      return await action();
    } catch (error) {
      // Log the error using the logError method
      this.logError(error as Error);
      // Rethrow the error to maintain the error flow
      throw error;
    }
  }
}

// Usage example
const prisma = new PrismaClient();
const errorLoggerConfig: ErrorLoggerConfig = {
  filePath: './logs',
};
const errorLogger = new ErrorLogger(prisma, errorLoggerConfig);

// Wrap a Prisma action with the errorHandler middleware
(async () => {
  try {
    await errorLogger.prismaErrorHandler(async () => {
      // Prisma action that may throw an error
      return await prisma.user.findMany();
    });
  } catch (error) {
    // Log the error and handle it appropriately
    console.error('Error occurred:', error);
  }
})();
