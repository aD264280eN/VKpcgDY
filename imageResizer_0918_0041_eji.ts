// 代码生成时间: 2025-09-18 00:41:51
// imageResizer.ts

/**
 * Image Resizer module, responsible for resizing images in batch.
 *
 * @module imageResizer
 */

import { PrismaClient } from '@prisma/client';
import { Sharp } from 'sharp';
import fs from 'fs';
import path from 'path';

// Define the prisma client instance globally
const prisma = new PrismaClient();

// Define the supported image formats
const supportedFormats = ['jpeg', 'png', 'jpg'];

// Check if the file is a supported format
function isSupportedFormat(filePath: string): boolean {
  const extension = path.extname(filePath).toLowerCase();
  return supportedFormats.includes(extension.slice(1));
}

// Resize an image and save it back to the disk
async function resizeImage(filePath: string, targetWidth: number, targetHeight: number): Promise<void> {
  try {
    await Sharp(filePath)
      .resize(targetWidth, targetHeight)
      .toFile(filePath);
  } catch (error) {
    console.error(`Error resizing image ${filePath}: ${error.message}`);
    throw error;
  }
}

// Process an image directory and resize all images within
async function processDirectory(directoryPath: string, targetWidth: number, targetHeight: number): Promise<void> {
  try {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isFile() && isSupportedFormat(filePath)) {
        await resizeImage(filePath, targetWidth, targetHeight);
        console.log(`Resized image: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}: ${error.message}`);
    throw error;
  }
}

// Main function to handle the resizing process
async function main() {
  try {
    // Define the directory path and new dimensions
    const directoryPath = './images';
    const targetWidth = 800;
    const targetHeight = 600;

    // Process the directory
    await processDirectory(directoryPath, targetWidth, targetHeight);
  } catch (error) {
    console.error(`Error in main function: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the main function
main();