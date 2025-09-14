// 代码生成时间: 2025-09-15 02:05:33
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ShoppingCartService {
  /**
   * Adds an item to the shopping cart.
   * @param userId The ID of the user adding the item.
   * @param itemId The ID of the item to add.
   * @returns Promise<boolean> Indicates whether the operation was successful.
   */
  async addItemToCart(userId: string, itemId: string): Promise<boolean> {
    try {
      await prisma.cartItem.create({
        data: {
          userId: userId,
          itemId: itemId,
        },
      });
      return true;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  }

  /**
   * Removes an item from the shopping cart.
   * @param userId The ID of the user removing the item.
   * @param itemId The ID of the item to remove.
   * @returns Promise<boolean> Indicates whether the operation was successful.
   */
  async removeItemFromCart(userId: string, itemId: string): Promise<boolean> {
    try {
      const result = await prisma.cartItem.delete({
        where: {
          userId_itemId: {
            userId: userId,
            itemId: itemId,
          },
        },
      });
      return result ? true : false;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    }
  }

  /**
   * Lists all items in the shopping cart for a user.
   * @param userId The ID of the user whose cart items are to be listed.
   * @returns Promise<any[]> An array of cart items.
   */
  async listCartItems(userId: string): Promise<any[]> {
    try {
      const items = await prisma.cartItem.findMany({
        where: {
          userId: userId,
        },
      });
      return items;
    } catch (error) {
      console.error('Error listing cart items:', error);
      return [];
    }
  }

  /**
   * Clears the shopping cart for a user.
   * @param userId The ID of the user whose cart is to be cleared.
   * @returns Promise<boolean> Indicates whether the operation was successful.
   */
  async clearCart(userId: string): Promise<boolean> {
    try {
      await prisma.cartItem.deleteMany({
        where: {
          userId: userId,
        },
      });
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }
}

export default ShoppingCartService;
