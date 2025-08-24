// 代码生成时间: 2025-08-24 12:40:01
import { PrismaClient } from '@prisma/client';

// 初始化 Prisma 客户端
const prisma = new PrismaClient();

// 定义一个类来处理用户权限相关的操作
class UserPermissionSystem {

  /**
   * 添加一个新的权限组
   * @param groupName 权限组名称
   * @returns 权限组ID和创建结果
   */
  async addPermissionGroup(groupName: string): Promise<{id: number, success: boolean}> {
    try {
      const newGroup = await prisma.permissionGroup.create({
        data: {
          name: groupName
        }
      });
      return { id: newGroup.id, success: true };
    } catch (error) {
      console.error('Failed to add permission group:', error);
      return { id: -1, success: false };
    }
  }

  /**
   * 给用户分配权限组
   * @param userId 用户ID
   * @param groupId 权限组ID
   * @returns 分配结果
   */
  async assignPermissionToUser(userId: number, groupId: number): Promise<{ success: boolean }> {
    try {
      await prisma.userPermission.create({
        data: {
          userId,
          permissionGroupId: groupId
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to assign permission to user:', error);
      return { success: false };
    }
  }

  /**
   * 获取用户的权限组列表
   * @param userId 用户ID
   * @returns 权限组列表
   */
  async getUserPermissions(userId: number): Promise<{ permissionGroups: Array<{ id: number, name: string }> }> {
    try {
      const permissions = await prisma.userPermission.findMany({
        where: {
          userId
        },
        include: {
          permissionGroup: true
        }
      });
      const permissionGroups = permissions.map(permission => permission.permissionGroup);
      return { permissionGroups };
    } catch (error) {
      console.error('Failed to get user permissions:', error);
      return { permissionGroups: [] };
    }
  }

  /**
   * 删除用户的权限组
   * @param userId 用户ID
   * @param groupId 权限组ID
   * @returns 删除结果
   */
  async removePermissionFromUser(userId: number, groupId: number): Promise<{ success: boolean }> {
    try {
      await prisma.userPermission.deleteMany({
        where: {
          userId,
          permissionGroupId: groupId
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to remove permission from user:', error);
      return { success: false };
    }
  }
}

// 导出 UserPermissionSystem 类
export default UserPermissionSystem;