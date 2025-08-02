// 代码生成时间: 2025-08-02 19:32:24
 * Features:
 * - Backup files from source to destination
 * - Sync files between source and destination
 * - Error handling for file operations
 * - Logging for actions performed
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { chmod } from 'fs';

// Change this to the path of your backup destination
const backupDestination = './backup/';
const fs = {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  chmod,
};

// Utility function to create directory if it doesn't exist
const ensureDirectory = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Function to backup files from source to destination
const backupFiles = async (source: string, backupDir: string) => {
  // Check if source directory exists
  if (!fs.existsSync(source)) {
    throw new Error(`Source directory does not exist: ${source}`);
  }

  ensureDirectory(backupDir);

  const files = fs.readdirSync(source);
  for (let file of files) {
    const sourceFile = join(source, file);
    const backupFile = join(backupDir, file);

    // Check if it's a directory (for recursive backup)
    if (fs.existsSync(sourceFile) && fs.lstatSync(sourceFile).isDirectory()) {
      backupFiles(sourceFile, backupFile); // Recursive backup for directories
    } else {
      fs.writeFileSync(backupFile, fs.readFileSync(sourceFile, 'utf-8'));
      console.log(`Backup successful: ${backupFile}`);
    }
  }
};

// Function to sync files between source and destination
const syncFiles = async (source: string, destination: string) => {
  // Check if source and destination directories exist
  if (!fs.existsSync(source)) {
    throw new Error(`Source directory does not exist: ${source}`);
  }
  if (!fs.existsSync(destination)) {
    throw new Error(`Destination directory does not exist: ${destination}`);
  }

  ensureDirectory(destination);

  const sourceFiles = fs.readdirSync(source);
  const destinationFiles = fs.readdirSync(destination);

  // Remove files from destination that are not in source
  for (let file of destinationFiles) {
    if (!sourceFiles.includes(file)) {
      const destinationFile = join(destination, file);
      fs.rmSync(destinationFile, { recursive: true, force: true });
      console.log(`Removed from destination: ${destinationFile}`);
    }
  }

  // Copy files from source to destination
  for (let file of sourceFiles) {
    if (!destinationFiles.includes(file)) {
      const sourceFile = join(source, file);
      const destinationFile = join(destination, file);
      fs.writeFileSync(destinationFile, fs.readFileSync(sourceFile, 'utf-8'));
      console.log(`Synced to destination: ${destinationFile}`);
    }
  }
};

// Main function to start the backup and sync process
const main = async () => {
  try {
    // Define the source directory path
    const sourceDirectory = './source/';

    // Backup files from source to destination
    await backupFiles(sourceDirectory, backupDestination);

    // Sync files between source and destination
    await syncFiles(sourceDirectory, backupDestination);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Execute the main function
main();