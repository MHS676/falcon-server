import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly uploadsDir: string;
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    // Use local uploads directory
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.appUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3001';
    
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'portfolio'): Promise<string> {
    try {
      // Use local file storage directly
      return await this.uploadToLocalStorage(file, folder);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = (error as any)?.response?.data || (error as Error)?.message || 'Failed to upload image';
      throw new BadRequestException(typeof message === 'string' ? message : 'Failed to upload image');
    }
  }

  private async uploadToLocalStorage(file: Express.Multer.File, folder: string): Promise<string> {
    const folderPath = path.join(this.uploadsDir, folder);
    
    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}-${randomStr}${ext}`;
    const filepath = path.join(folderPath, filename);

    // Write file
    const buffer = file.buffer ?? (file.path ? fs.readFileSync(file.path) : null);
    if (!buffer) {
      throw new BadRequestException('File buffer is empty');
    }
    
    fs.writeFileSync(filepath, buffer);

    // Return URL path (accessible via static serve)
    return `${this.appUrl}/uploads/${folder}/${filename}`;
  }

  async deleteImage(_publicId: string): Promise<boolean> {
    // For local storage, we could implement file deletion
    // For now, returning false as it's optional
    return false;
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'portfolio',
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file, folder));
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException('Failed to upload images');
    }
  }

  getOptimizedUrl(publicIdOrUrl: string): string {
    // For local storage URLs, return as-is
    if (/^https?:\/\//i.test(publicIdOrUrl)) {
      return publicIdOrUrl;
    }
    // Fallback: return the identifier unchanged
    return publicIdOrUrl;
  }
}