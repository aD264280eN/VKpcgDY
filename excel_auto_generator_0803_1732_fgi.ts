// 代码生成时间: 2025-08-03 17:32:29
import { PrismaClient } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs/promises';

// Define the schema to match your database tables
type ExcelSchema = {
  // Define columns according to your database fields
  id?: number;
  name?: string;
  date?: Date;
  // ... add more columns as needed
};

class ExcelAutoGenerator {
  private prisma: PrismaClient;
  private excel: ExcelJS.Workbook;

  constructor() {
    this.prisma = new PrismaClient();
    this.excel = new ExcelJS.Workbook();
  }

  /**
   * Generates an Excel sheet based on the given schema.
   * @param schema The Excel schema to use for generating the sheet.
   * @param tableName The name of the database table to pull data from.
   * @returns Promise<void>
   */
  async generateExcelSheet(schema: ExcelSchema, tableName: string): Promise<void> {
    try {
      // Select data from the database using Prisma
      const data = await this.prisma[tableName].findMany();

      // Create a new worksheet and add it to the workbook
      const worksheet = this.excel.addWorksheet('Generated Sheet');

      // Add headers to the worksheet based on the schema
      for (const key in schema) {
        worksheet.columns.push({ header: key, key: key });
      }

      // Add data rows to the worksheet
      for (const item of data) {
        worksheet.addRow(Object.values(item));
      }

      // Write the workbook to a file
      await this.excel.xlsx.writeFile('generated_excel.xlsx');

      console.log('Excel sheet generated successfully.');
    } catch (error) {
      console.error('Failed to generate Excel sheet:', error);
      throw error;
    }
  }

  /**
   * Closes the Prisma client connection.
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Example usage
const excelGenerator = new ExcelAutoGenerator();

// Replace 'your_table_name' with the actual table name from your database
excelGenerator.generateExcelSheet({}, 'your_table_name')
  .then(() => excelGenerator.close())
  .catch((error) => console.error('An error occurred:', error));