import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly baseUrl?: string;
  private readonly uploadsDir: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('IMAGE_UPLOAD_SERVICE_URL');
    // Use local uploads directory
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'portfolio'): Promise<string> {
    try {
      // Try external service first if configured
      if (this.baseUrl) {
        try {
          const buffer = file.buffer ?? (file.path ? fs.readFileSync(file.path) : undefined);
          if (buffer) {
            const externalUrl = await this.uploadToExternalService(buffer, file.originalname, folder, file.mimetype);
            if (externalUrl) return externalUrl;
          }
        } catch (error) {
          console.warn('External upload failed, falling back to local storage:', error);
        }
      }
      
      // Fallback to local file storage
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
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3001';
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }

  private async uploadToExternalService(
    buffer: Buffer,
    filename: string,
    folder: string,
    mimeType?: string,
  ): Promise<string | null> {
    if (!this.baseUrl) return null;
    
    const base = this.baseUrl.replace(/\/$/, '');
    const endpoints = ['/upload', '/api/upload', '/images/upload', '/images', '/file/upload', ''];
    const fieldNames = ['file', 'image', 'upload', 'photo'];

    for (const ep of endpoints) {
      const url = base + ep;
      for (const field of fieldNames) {
        try {
          const form = new FormData();
          form.append(field, buffer, {
            filename,
            contentType: mimeType,
          } as any);
          if (folder) form.append('folder', folder);

          const res = await axios.post(url, form, {
            headers: form.getHeaders(),
            maxBodyLength: Infinity,
            validateStatus: () => true,
          });
          
          if (res.status >= 200 && res.status < 300) {
            const data = res.data || {};
            const imageUrl =
              data.url || data.secure_url || data.location || data.imageUrl || data.result?.url || res.headers?.location;
            if (typeof imageUrl === 'string' && /^https?:\/\//i.test(imageUrl)) {
              return imageUrl;
            }
          }
        } catch (e: any) {
          // Continue to next combination
        }
      }
    }
    return null;
  }

  async deleteImage(publicId: string): Promise<boolean> {
    // Optional: if external service supports deletion; otherwise return false
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
    // Generate a best-effort optimized URL. External service may ignore options.
    getOptimizedUrl(
      publicIdOrUrl: string,
      options: {
        width?: number;
        height?: number;
        crop?: string;
        quality?: string;
        format?: string;
      } = {},
    ): string {
      // If already a full URL, return as-is (external service may already serve optimized assets)
      if (/^https?:\/\//i.test(publicIdOrUrl)) {
        return publicIdOrUrl;
      }
      // If we have a base URL, construct a direct URL
      const base = (this.baseUrl || '').replace(/\/$/, '');
      if (base) {
        // Append simple query params if provided (best effort)
        const url = `${base}/${publicIdOrUrl}`;
        const params = new URLSearchParams();
        if (options.width) params.set('w', String(options.width));
        if (options.height) params.set('h', String(options.height));
        if (options.quality) params.set('q', options.quality);
        if (options.format) params.set('fm', options.format);
        const query = params.toString();
        return query ? `${url}?${query}` : url;
      }
      // Fallback: return the identifier unchanged
      return publicIdOrUrl;
    }

  // With external service we don't transform URLs here
}