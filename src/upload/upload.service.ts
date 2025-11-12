import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
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

      const url = this.baseUrl.replace(/\/$/, '') + '/upload';
      const form = new FormData();
      form.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });
      form.append('folder', folder);

      const res = await axios.post(url, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });
      const data = res.data || {};
      const imageUrl = data.url || data.secure_url || data.location || data.imageUrl || data.result?.url;
      if (!imageUrl) throw new BadRequestException('Image upload failed: no URL returned');
      return imageUrl;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to upload image');
    }
  }

  async uploadImageFromBuffer(
    buffer: Buffer,
    filename: string,
    folder = 'portfolio',
  ): Promise<string> {
    try {
      if (!this.baseUrl) {
        throw new BadRequestException('Image upload service URL is not configured');
      }
      const url = this.baseUrl.replace(/\/$/, '') + '/upload';
      const form = new FormData();
      form.append('file', buffer, {
        filename,
      });
      form.append('folder', folder);

      const res = await axios.post(url, form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
      });
      const data = res.data || {};
      const imageUrl = data.url || data.secure_url || data.location || data.imageUrl || data.result?.url;
      if (!imageUrl) throw new BadRequestException('Image upload failed: no URL returned');
      return imageUrl;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Failed to upload image');
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

  // With external service we don't transform URLs here
}