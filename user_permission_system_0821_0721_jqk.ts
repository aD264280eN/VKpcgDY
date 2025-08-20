// 代码生成时间: 2025-08-21 07:21:54
import { PrismaClient } from '@prisma/client';

// Define User model based on Prisma schema
interface User {
  id: string;
  name: string;
  roles: string[];
}

// Define Role model based on Prisma schema
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

class UserPermissionSystem {
  private prisma: PrismaClient;

  // Constructor to initialize the Prisma client
  constructor() {
    this.prisma = new PrismaClient();
  }

  // Function to get user roles
  async getUserRoles(userId: string): Promise<string[]> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user.roles;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  }

  // Function to assign role to a user
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
      });
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  // Function to remove role from a user
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          roles: {
            disconnect: { id: roleId },
          },
        },
      });
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }

  // Function to get role permissions
  async getRolePermissions(roleId: string): Promise<string[]> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        select: { permissions: true },
      });
      if (!role) {
        throw new Error('Role not found');
      }
      return role.permissions;
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      throw error;
    }
  }

  // Function to add permission to a role
  async addPermissionToRole(roleId: string, permission: string): Promise<void> {
    try {
      await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: {
              name: permission,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error adding permission to role:', error);
      throw error;
    }
  }

  // Function to remove permission from a role
  async removePermissionFromRole(roleId: string, permission: string): Promise<void> {
    try {
      await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            disconnect: {
              name: permission,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error removing permission from role:', error);
      throw error;
    }
  }
}

// Usage example
const permissionSystem = new UserPermissionSystem();

// Assign a role to a user
permissionSystem.assignRoleToUser('user-id-123', 'role-id-456')
  .then(() => console.log('Role assigned successfully'))
  .catch((error) => console.error('Failed to assign role:', error));

// Remove a role from a user
permissionSystem.removeRoleFromUser('user-id-123', 'role-id-456')
  .then(() => console.log('Role removed successfully'))
  .catch((error) => console.error('Failed to remove role:', error));

// Add a permission to a role
permissionSystem.addPermissionToRole('role-id-456', 'new-permission')
  .then(() => console.log('Permission added successfully'))
  .catch((error) => console.error('Failed to add permission:', error));

// Remove a permission from a role
permissionSystem.removePermissionFromRole('role-id-456', 'existing-permission')
  .then(() => console.log('Permission removed successfully'))
  .catch((error) => console.error('Failed to remove permission:', error));
