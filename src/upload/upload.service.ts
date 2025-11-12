import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly baseUrl?: string;

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('IMAGE_UPLOAD_SERVICE_URL');
  }

  async uploadImage(file: Express.Multer.File, folder = 'portfolio'): Promise<string> {
    try {
      if (!this.baseUrl) {
        throw new BadRequestException('Image upload service URL is not configured');
      }
      const buffer = file.buffer ?? (file.path ? fs.readFileSync(file.path) : undefined);
      if (!buffer) {
        throw new BadRequestException('Uploaded file buffer is empty');
      }
      return await this.uploadImageFromBuffer(buffer, file.originalname, folder, file.mimetype);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = (error as any)?.response?.data || (error as Error)?.message || 'Failed to upload image';
      throw new BadRequestException(typeof message === 'string' ? message : 'Failed to upload image');
    }
  }

  async uploadImageFromBuffer(
    buffer: Buffer,
    filename: string,
    folder = 'portfolio',
    mimeType?: string,
  ): Promise<string> {
    try {
      if (!this.baseUrl) {
        throw new BadRequestException('Image upload service URL is not configured');
      }
      const base = this.baseUrl.replace(/\/$/, '');
      const endpoints = ['/upload', '/api/upload', '/images/upload', '/images', '/file/upload', ''];
      const fieldNames = ['file', 'image', 'upload', 'photo'];

      let lastErr: any = null;
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
            } else {
              lastErr = res.data || res.statusText;
            }
          } catch (e: any) {
            lastErr = e?.response?.data || e?.message || e;
            // try next combination
          }
        }
      }
      throw new BadRequestException(
        `Failed to upload image via external service${lastErr ? `: ${typeof lastErr === 'string' ? lastErr : JSON.stringify(lastErr).slice(0,300)}` : ''}`,
      );
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = (error as any)?.response?.data || (error as Error)?.message || 'Failed to upload image';
      throw new BadRequestException(typeof message === 'string' ? message : 'Failed to upload image');
    }
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