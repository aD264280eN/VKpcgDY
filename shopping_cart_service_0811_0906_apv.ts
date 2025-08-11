// 代码生成时间: 2025-08-11 09:06:50
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The ShoppingCartService class handles all the operations related to a shopping cart.
class ShoppingCartService {
  // Add an item to the shopping cart.
  async addItemToCart(cartId: string, itemId: string): Promise<void> {
    try {
      // Check if the item already exists in the cart.
      const existingItem = await prisma.cartItem.findFirst({
        where: { cartId, itemId },
      });
      if (existingItem) {
        // If the item exists, increment the quantity.
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: { increment: 1 } },
        });
      } else {
        // If the item does not exist, add it to the cart.
        await prisma.cartItem.create({
          data: { cartId, itemId, quantity: 1 },
        });
      }
    } catch (error) {
      // Handle any errors that may occur.
      throw new Error('Failed to add item to cart: ' + error.message);
    }
  }

  // Remove an item from the shopping cart.
  async removeItemFromCart(cartItemId: string): Promise<void> {
    try {
      // Delete the item from the cart.
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } catch (error) {
      // Handle any errors that may occur.
      throw new Error('Failed to remove item from cart: ' + error.message);
    }
  }

  // Get the current items in the shopping cart.
  async getCartItems(cartId: string): Promise<any[]> {
    try {
      // Retrieve all items in the cart.
      const items = await prisma.cartItem.findMany({
        where: { cartId },
        include: { item: true },
      });

      // Return the items in a formatted array.
      return items.map((item) => ({
        id: item.id,
        itemId: item.itemId,
        quantity: item.quantity,
        name: item.item.name,
        price: item.item.price,
      }));
    } catch (error) {
      // Handle any errors that may occur.
      throw new Error('Failed to get cart items: ' + error.message);
    }
  }

  // Clear the shopping cart.
  async clearCart(cartId: string): Promise<void> {
    try {
      // Delete all items associated with the cart.
      await prisma.$transaction(
        prisma.cartItem.findMany({
          where: { cartId },
        }).map((item) => prisma.cartItem.delete({ where: { id: item.id } }))
      );
    } catch (error) {
      // Handle any errors that may occur.
      throw new Error('Failed to clear cart: ' + error.message);
    }
  }
}

export default ShoppingCartService;