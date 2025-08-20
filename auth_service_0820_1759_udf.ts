// 代码生成时间: 2025-08-20 17:59:18
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

// Define a schema for the input data using Zod
const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// Define a Prisma client instance
const prisma = new PrismaClient();

class AuthService {
  /**
   * Authenticate a user by their username and password
   * @param username The username of the user
   * @param password The password of the user
   * @returns A promise that resolves to true if the user is authenticated, or an error otherwise
   */
  async authenticateUser(username: string, password: string): Promise<boolean> {
    // Validate input data using Zod
    const { error } = LoginSchema.safeParse({ username, password });
    if (error) throw new Error('Invalid input data');

    try {
      // Find user by username
      const user = await prisma.user.findUnique({
        where: {
          username
        },
        select: {
          password: true,
        },
      });

      if (!user) throw new Error('User not found');

      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error('Invalid password');

      // Authentication successful
      return true;
    } catch (error) {
      // Handle any errors that occur during the authentication process
      console.error('Authentication failed:', error);
      throw new Error('Authentication failed');
    }
  }
}

export default AuthService;