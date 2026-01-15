import fs from 'fs';
import path from 'path';

export class FileSystemHelper {
  
  // Create directory if it doesn't exist
  static createDirIfNotExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Get base upload directory
  static getBaseUploadDir(): string {
    return path.join(process.cwd(), 'uploads');
  }

  // Initialize all upload directories
  static initializeUploadDirs(dirs: string[]): void {
    const baseDir = this.getBaseUploadDir();
    this.createDirIfNotExists(baseDir);

    dirs.forEach(dir => {
      const fullPath = path.join(process.cwd(), dir);
      this.createDirIfNotExists(fullPath);
    });
  }

  // Generate unique filename
  static generateUniqueFilename(originalName: string): string {
    const fileExt = path.extname(originalName);
    const baseName = originalName
      .replace(fileExt, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);

    return `${baseName}-${Date.now()}${fileExt}`;
  }

  // Delete file
  static deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}