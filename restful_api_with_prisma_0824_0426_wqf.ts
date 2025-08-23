// 代码生成时间: 2025-08-24 04:26:31
 * This is a TypeScript program that demonstrates the development of a RESTful API interface using Prisma framework.
 * The program includes error handling, proper documentation, and follows TypeScript best practices.
 */

// Import necessary modules
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { z } from 'zod';

// Initialize Prisma client
const prisma = new PrismaClient();

// Define a schema for validation
const ItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string().optional()
});

// Create an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to create a new item
app.post('/items', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedBody = ItemSchema.parse(req.body);

    // Create a new item in the database
    const item = await prisma.item.create({
      data: parsedBody
    });

    // Send the created item back to the client
    res.status(201).json(item);
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      // Handle other errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// GET endpoint to retrieve all items
app.get('/items', async (req: Request, res: Response) => {
  try {
    // Retrieve all items from the database
    const items = await prisma.item.findMany();

    // Send the items back to the client
    res.json(items);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET endpoint to retrieve a single item by ID
app.get('/items/:id', async (req: Request, res: Response) => {
  try {
    // Retrieve a single item by ID from the database
    const item = await prisma.item.findUnique({
      where: { id: req.params.id }
    });

    // If the item is found, send it back to the client
    if (item) {
      res.json(item);
    } else {
      // If the item is not found, send a 404 error
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT endpoint to update an item
app.put('/items/:id', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const parsedBody = ItemSchema.parse(req.body);

    // Update an item in the database
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: parsedBody
    });

    // Send the updated item back to the client
    res.json(item);
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      // Handle other errors
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// DELETE endpoint to delete an item
app.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    // Delete an item from the database
    const result = await prisma.item.delete({
      where: { id: req.params.id }
    });

    // Send the deleted item back to the client
    res.json(result);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});