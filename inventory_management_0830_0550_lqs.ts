// 代码生成时间: 2025-08-30 05:50:15
// inventory_management.ts

import { PrismaClient } from '@prisma/client';

// 定义库存管理系统类
class InventoryManagement {
  private prisma: PrismaClient;

  constructor() {
    // 初始化Prisma客户端
    this.prisma = new PrismaClient();
  }

  // 获取所有库存项
  async getAllItems(): Promise<Array<{ id: number; name: string; quantity: number }>> {
    try {
      const items = await this.prisma.item.findMany();
      return items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }));
    } catch (error) {
      console.error('Error fetching all items:', error);
      throw new Error('Failed to fetch items');
    }
  }

  // 添加库存项
  async addItem(name: string, quantity: number): Promise<{ id: number; name: string; quantity: number }> {
    try {
      const item = await this.prisma.item.create({ data: { name, quantity } });
      return { id: item.id, name: item.name, quantity: item.quantity };
    } catch (error) {
      console.error('Error adding item:', error);
      throw new Error('Failed to add item');
    }
  }

  // 更新库存项
  async updateItem(id: number, name: string, quantity: number): Promise<{ id: number; name: string; quantity: number }> {
    try {
      const item = await this.prisma.item.update({ where: { id }, data: { name, quantity } });
      return { id: item.id, name: item.name, quantity: item.quantity };
    } catch (error) {
      console.error('Error updating item:', error);
      throw new Error('Failed to update item');
    }
  }

  // 删除库存项
  async deleteItem(id: number): Promise<void> {
    try {
      await this.prisma.item.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  }

  // 清理资源
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// 使用示例
async function main() {
  const inventory = new InventoryManagement();
  try {
    const items = await inventory.getAllItems();
    console.log('All items:', items);

    // 添加一个新库存项
    const newItem = await inventory.addItem('Example Item', 100);
    console.log('Added item:', newItem);

    // 更新库存项
    const updatedItem = await inventory.updateItem(newItem.id, 'Updated Item', 150);
    console.log('Updated item:', updatedItem);

    // 删除库存项
    await inventory.deleteItem(updatedItem.id);
    console.log('Deleted item');

    // 清理资源
    await inventory.close();
  } catch (error) {
    console.error(error);
  }
}

// 运行主函数
main();
