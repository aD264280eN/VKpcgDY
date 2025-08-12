// 代码生成时间: 2025-08-12 21:37:57
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import readdir from 'fs/promises';
import { gzip } from 'zlib';
import { pipeline } from 'stream';

// Create a new instance of PrismaClient
const prisma = new PrismaClient();

// Async function to read directory contents
const readDirectory = async (directory: string): Promise<string[]> => {
  try {
    return await readdir(directory);
  } catch (error) {
    throw new Error(`Error reading directory: ${error.message}`);
  }
};

// Async function to backup a file
const backupFile = async (file: string, backupDir: string): Promise<void> => {
  try {
    const fileName = path.basename(file);
    const backupPath = path.join(backupDir, fileName);

    // Compress the file using gzip
    await pipeline(
      fs.createReadStream(file),
      gzip(),
      fs.createWriteStream(backupPath),
    );

    console.log(`Backup successful: ${file} -> ${backupPath}`);
  } catch (error) {
    throw new Error(`Error backing up file: ${error.message}`);
  }
};

// Async function to synchronize files between two directories
const syncDirectories = async (sourceDir: string, targetDir: string): Promise<void> => {
  try {
    const sourceFiles = await readDirectory(sourceDir);
    const targetFiles = await readDirectory(targetDir);

    for (const file of sourceFiles) {
      const sourceFilePath = path.join(sourceDir, file);
      const targetFilePath = path.join(targetDir, file);

      // Check if the file exists in the target directory
      if (!targetFiles.includes(file)) {
        console.log(`File not found in target directory, syncing: ${file}`);
        await backupFile(sourceFilePath, targetDir);
      } else {
        // Check if the files are different (e.g., by comparing file sizes)
        const sourceStats = fs.statSync(sourceFilePath);
        const targetStats = fs.statSync(targetFilePath);

        if (sourceStats.size !== targetStats.size) {
          console.log(`File size mismatch, syncing: ${file}`);
          await backupFile(sourceFilePath, targetDir);
        }
      }
    }
  } catch (error) {
    throw new Error(`Error synchronizing directories: ${error.message}`);
  }
};

// Main function to run the backup and sync tool
const main = async () => {
  try {
    const sourceDirectory = './source'; // Source directory path
    const backupDirectory = './backup'; // Backup directory path

    // Create backup directory if it doesn't exist
    if (!fs.existsSync(backupDirectory)) {
      fs.mkdirSync(backupDirectory, { recursive: true });
    }

    // Synchronize files between source and backup directories
    await syncDirectories(sourceDirectory, backupDirectory);
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
  } finally {
    // Close the Prisma client connection
    await prisma.$disconnect();
  }
};

// Run the main function
main();