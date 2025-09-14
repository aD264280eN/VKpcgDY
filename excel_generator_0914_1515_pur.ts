// 代码生成时间: 2025-09-14 15:15:32
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { readFileSync } from 'fs';
import path from 'path';

// 定义一个类，用于处理Excel文件生成
class ExcelGenerator {
  private prisma: PrismaClient;
  private workbook: ExcelJS.Workbook;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.workbook = new ExcelJS.Workbook();
  }

  // 从数据库获取数据
  private async fetchData(): Promise<ExcelJS.WorksheetRow[]> {
    try {
      // 假设有一个名为'data'的表
      const data = await this.prisma.data.findMany();
      return data.map((item) => this.rowDataFromDataItem(item));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      throw error;
    }
  }

  // 将数据项转换为Excel行数据
  private rowDataFromDataItem(item: any): ExcelJS.WorksheetRow {
    // 这里需要根据实际的数据结构来定义
    return {
      A1: item.id,
      B1: item.name,
      // 添加更多的字段映射...
    };
  }

  // 创建Excel工作表
  public async createWorksheet(name: string): Promise<void> {
    try {
      const sheet = this.workbook.addWorksheet(name);
      const headers = ['ID', 'Name', /* 添加更多的表头... */];
      sheet.columns = [
        { header: headers[0], key: 'id', width: 10 },
        { header: headers[1], key: 'name', width: 20 },
        // 添加更多的列定义...
      ];

      const rows = await this.fetchData();
      sheet.addRows(rows);
    } catch (error) {
      console.error('Failed to create worksheet:', error);
      throw error;
    }
  }

  // 将工作簿保存为Excel文件
  public async saveWorkbook(excelPath: string): Promise<void> {
    try {
      await this.workbook.xlsx.writeFile(excelPath);
      console.log('Excel file generated successfully');
    } catch (error) {
      console.error('Failed to save workbook:', error);
      throw error;
    }
  }
}

// 使用示例
(async () => {
  const prisma = new PrismaClient();
  const excelGen = new ExcelGenerator(prisma);
  await excelGen.createWorksheet('DataSheet');
  const excelPath = path.join(__dirname, 'data.xlsx');
  await excelGen.saveWorkbook(excelPath);
  await prisma.$disconnect();
})();