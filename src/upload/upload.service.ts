import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly isConfigured: boolean;

  constructor(private configService: ConfigService) {
    const cloud_name = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const api_key = this.configService.get<string>('CLOUDINARY_API_KEY');
    const api_secret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    cloudinary.config({ cloud_name, api_key, api_secret });
    this.isConfigured = !!(cloud_name && api_key && api_secret);
  }

  async uploadImage(file: Express.Multer.File, folder = 'portfolio'): Promise<string> {
    try {
      if (!this.isConfigured) {
        throw new BadRequestException('Image upload is not configured on the server');
      }
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });
      
      return result.secure_url;
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
    return new Promise((resolve, reject) => {
      if (!this.isConfigured) {
        return reject(new BadRequestException('Image upload is not configured on the server'));
      }
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: filename,
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(new BadRequestException('Failed to upload image'));
            } else {
              resolve(result.secure_url);
            }
          },
        )
        .end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new BadRequestException('Failed to delete image');
    }
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

  // Extract public ID from Cloudinary URL
  extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  // Generate optimized URL with transformations
  getOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    return cloudinary.url(publicId, {
      width: options.width,
      height: options.height,
      crop: options.crop || 'fill',
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
    });
  }
}