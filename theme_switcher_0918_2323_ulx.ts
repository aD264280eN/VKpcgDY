// 代码生成时间: 2025-09-18 23:23:08
// theme_switcher.ts

import { PrismaClient } from '@prisma/client';

class ThemeSwitcher {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Switches the theme for a given user.
   * @param userId The ID of the user who wants to switch the theme.
   * @param newTheme The new theme to be applied.
   * @returns A promise that resolves to the updated theme, or an error if something goes wrong.
   */
  async switchTheme(userId: string, newTheme: string): Promise<string> {
    try {
      // Find the user to ensure they exist
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId
        },
        select: {
          theme: true
        }
      });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update the user theme
      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          theme: newTheme
        }
      });
      
      return updatedUser.theme;
    } catch (error) {
      // Handle errors
      console.error('Error switching theme:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection.
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Example usage:
// const themeSwitcher = new ThemeSwitcher();
// themeSwitcher.switchTheme('123', 'dark').then(newTheme => {
//   console.log('New theme set:', newTheme);
// }).catch(error => {
//   console.error('Failed to switch theme:', error);
// });
// themeSwitcher.close();