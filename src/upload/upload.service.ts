import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly uploadsDir: string;
  private readonly appUrl: string;

  constructor(private configService: ConfigService) {
    // Use persistent storage directory for production, local for development
    // Railway provides /data as persistent storage volume
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const baseDir = isProd ? '/data' : process.cwd();
    this.uploadsDir = path.join(baseDir, 'uploads');
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

    // Write file - handle both buffer and stream cases
    let buffer: Buffer;
    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = fs.readFileSync(file.path);
    } else {
      throw new BadRequestException('File buffer is empty');
    }
    
    // Ensure we have data
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('File has no data');
    }
    
    try {
      fs.writeFileSync(filepath, buffer);
      console.log(`✅ File saved: ${filepath}`);
    } catch (err) {
      console.error(`❌ Failed to save file: ${filepath}`, err);
      throw new BadRequestException(`Failed to write file: ${(err as Error)?.message}`);
    }

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