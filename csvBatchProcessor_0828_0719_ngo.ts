// 代码生成时间: 2025-08-28 07:19:46
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csvParse from 'csv-parse';
import csvStringify from 'csv-stringify';

// Define a type for the CSV row
interface CsvRow {
  // Define properties based on your CSV structure
  id?: number;
  name?: string;
  // Add other fields as needed
}

// Initialize the Prisma Client
const prisma = new PrismaClient();

// Function to process a single CSV file
async function processCsvFile(file: string): Promise<void> {
  try {
    const data = fs.readFileSync(file, 'utf8');
    const records = [];

    // Parse CSV file
    await new Promise((resolve, reject) => {
      csvParse(data, {
        columns: true,
        skip_empty_lines: true,
      }, (err, output) => {
        if (err) {
          reject(err);
        } else {
          records.push(...output);
          resolve();
        }
      });
    });

    // Process each record, e.g., save to the database
    for (const record of records) {
      // Here you would add your business logic, e.g.,
      // await prisma.yourModel.create({ data: record });
      console.log(record); // Replace with actual database operation
    }

    console.log(`Processed file: ${file}`);
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
  }
}

// Function to process multiple CSV files in a directory
async function processCsvDirectory(directory: string): Promise<void> {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      if (file.endsWith('.csv')) {
        await processCsvFile(`${directory}/${file}`);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// Example usage:
// processCsvDirectory('./csvFiles').then(() => {
//   console.log('All CSV files processed successfully');
// }).catch((error) => {
//   console.error('An error occurred during processing:', error);
// });

// Note: Replace './csvFiles' with the path to your CSV files directory
// and uncomment the above lines to run the processor

// Close the Prisma client connection
async function closePrismaClient() {
  await prisma.$disconnect();
}

// Call the function when the script is done
process.on('exit', closePrismaClient);
