// 代码生成时间: 2025-08-02 07:07:48
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Util.promisify for async file operations
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Resizes an image file based on the given dimensions.
 * @param filePath The file path of the image to resize.
 * @param dimensions The new dimensions of the image.
 */
async function resizeImage(filePath: string, dimensions: { width: number; height: number }): Promise<void> {
  try {
    await sharp(filePath).resize(dimensions).toFile(path.join(path.dirname(filePath), 'resized_' + path.basename(filePath)));
  } catch (error) {
    console.error('Error resizing image:', error);
  }
}

/**
 * Scans the directory for image files and resizes them.
 * @param directoryPath The path to the directory containing images.
 * @param dimensions The dimensions to resize the images to.
 */
async function batchResizeImages(directoryPath: string, dimensions: { width: number; height: number }): Promise<void> {
  try {
    // Read the directory contents
    const files = await readdir(directoryPath);
    
    // Filter for image files
    const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
    
    for (const file of imageFiles) {
      const filePath = path.join(directoryPath, file);
      
      // Check if the file exists and is a file
      const fileStats = await stat(filePath);
      if (fileStats.isFile()) {
        await resizeImage(filePath, dimensions);
      }
    }
  } catch (error) {
    console.error('Error processing directory:', error);
  }
}

// Example usage
batchResizeImages('./images', { width: 800, height: 600 })
  .then(() => console.log('Images resized successfully.'))
  .catch(error => console.error('Failed to resize images:', error));

// Close the Prisma connection at the end of the program
process.on('exit', () => {
  prisma.$disconnect();
});