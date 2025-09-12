// 代码生成时间: 2025-09-13 04:33:48
 * @author [Your Name]
 * @version 1.0.0
 */

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface FolderStructure {
  name: string;
  children?: FolderStructure[];
}

class FolderStructureOrchestrator {
  
  /**
   * 递归创建文件夹结构
   * @param folderPath 要创建的文件夹路径
   * @param structure 文件夹结构
   */
  async createFolderStructure(folderPath: string, structure: FolderStructure): Promise<void> {
    if (!structure) return;
    
    try {
      const resolvedPath = path.resolve(folderPath, structure.name);
      await fs.mkdir(resolvedPath, { recursive: true }); // 递归创建文件夹
      console.log(`Created folder: ${resolvedPath}`);
    } catch (error) {
      console.error(`Failed to create folder: ${structure.name}`, error);
    }
    
    if (structure.children) {
      await Promise.all(structure.children.map(child => this.createFolderStructure(folderPath, child)));
    }
  }

  /**
   * 获取文件夹当前结构
   * @param folderPath 要获取的文件夹路径
   */
  async getFolderStructure(folderPath: string): Promise<FolderStructure> {
    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true });
      const folders: FolderStructure[] = [];
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subFolderPath = path.resolve(folderPath, entry.name);
          const subFolderStructure = await this.getFolderStructure(subFolderPath);
          folders.push({
            name: entry.name,
            children: subFolderStructure.children,
          });
        }
      }
      
      return {
        name: path.basename(folderPath),
        children: folders,
      };
    } catch (error) {
      console.error(`Failed to get folder structure: ${folderPath}`, error);
      throw error;
    }
  }

  /**
   * 同步文件夹结构
   * @param folderPath 要同步的文件夹路径
   * @param structure 目标文件夹结构
   */
  async syncFolderStructure(folderPath: string, structure: FolderStructure): Promise<void> {
    try {
      const currentStructure = await this.getFolderStructure(folderPath);
      
      // 递归同步文件夹结构
      await this._syncFolderStructureRecursive(currentStructure, structure);
    } catch (error) {
      console.error(`Failed to sync folder structure: ${folderPath}`, error);
    }
  }

  /**
   * 递归同步文件夹结构
   * @param currentStructure 当前文件夹结构
   * @param targetStructure 目标文件夹结构
   */
  private async _syncFolderStructureRecursive(currentStructure: FolderStructure, targetStructure: FolderStructure): Promise<void> {
    if (this._structuresAreEqual(currentStructure, targetStructure)) return;
    
    const currentChildren = new Set(currentStructure.children?.map(child => child.name) || []);
    const targetChildren = new Set(targetStructure.children?.map(child => child.name) || []);    
    
    // 删除多余的文件夹
    for (const name of currentChildren) {
      if (!targetChildren.has(name)) {
        const folderPath = path.resolve(folderPath, name);
        await fs.rmdir(folderPath, { recursive: true });
        console.log(`Deleted folder: ${folderPath}`);
      }
    }
    
    // 创建缺失的文件夹
    for (const name of targetChildren) {
      if (!currentChildren.has(name)) {
        const folderPath = path.resolve(folderPath, name);
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Created folder: ${folderPath}`);
      }
    }
    
    // 递归同步子文件夹结构
    for (const targetChild of targetStructure.children || []) {
      const currentChild = currentStructure.children?.find(child => child.name === targetChild.name);
      await this._syncFolderStructureRecursive(currentChild || { name: targetChild.name }, targetChild);
    }
  }

  /**
   * 检查两个文件夹结构是否相等
   * @param currentStructure 当前文件夹结构
   * @param targetStructure 目标文件夹结构
   */
  private _structuresAreEqual(currentStructure: FolderStructure, targetStructure: FolderStructure): boolean {
    if (currentStructure.name !== targetStructure.name) return false;
    
    const currentChildren = new Set(currentStructure.children?.map(child => child.name) || []);
    const targetChildren = new Set(targetStructure.children?.map(child => child.name) || []);
    
    return currentChildren.size === targetChildren.size &&
           [...currentChildren].every(name => targetChildren.has(name));
  }
}

// 示例用法
const orchestrator = new FolderStructureOrchestrator();

const targetStructure: FolderStructure = {
  name: 'project',
  children: [
    { name: 'src' },
    { name: 'tests' },
    { name: 'dist' },
  ],
};

orchestrator.createFolderStructure('/path/to/project', targetStructure)
  .then(() => console.log('Folder structure created'))
  .catch(console.error);

orchestrator.syncFolderStructure('/path/to/project', targetStructure)
  .then(() => console.log('Folder structure synced'))
  .catch(console.error);
