/** @format */

import { Injectable, BadRequestException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

@Injectable()
export class UploadService {
  private readonly uploadsDir: string;
  private readonly appUrl: string;
  private readonly useCloudinary: boolean;

  constructor(private configService: ConfigService) {
    // Use persistent storage directory for production, local for development
    // Railway provides /data as persistent storage volume
    const isProd = this.configService.get<string>("NODE_ENV") === "production";
    const baseDir = isProd ? "/data" : process.cwd();
    this.uploadsDir = path.join(baseDir, "uploads");
    this.appUrl =
      this.configService.get<string>("APP_URL") || "http://localhost:3001";

    // Configure Cloudinary if credentials are present
    const cloudName = this.configService.get<string>("CLOUDINARY_CLOUD_NAME");
    const apiKey = this.configService.get<string>("CLOUDINARY_API_KEY");
    const apiSecret = this.configService.get<string>("CLOUDINARY_API_SECRET");

    this.useCloudinary = !!(cloudName && apiKey && apiSecret);

    if (this.useCloudinary) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      console.log("✅ Cloudinary configured successfully");
    } else {
      console.log("⚠️ Cloudinary not configured, using local storage");
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = "portfolio",
  ): Promise<string> {
    try {
      // Check if file is a document (PDF, DOC, DOCX)
      const isDocument = file.originalname.match(/\.(pdf|doc|docx)$/i);
      
      if (this.useCloudinary) {
        return await this.uploadToCloudinary(file, folder, isDocument ? 'raw' : 'auto');
      }
      // Fallback to local file storage
      return await this.uploadToLocalStorage(file, folder);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message =
        (error as any)?.response?.data ||
        (error as Error)?.message ||
        "Failed to upload image";
      throw new BadRequestException(
        typeof message === "string" ? message : "Failed to upload image",
      );
    }
  }

  private async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'auto' | 'image' | 'video' | 'raw' = 'auto',
  ): Promise<string> {
    // Validate file buffer exists
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("File buffer is empty");
    }

    // Generate a unique filename
    const originalName = file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueId = `${baseName}_${Date.now()}`;

    try {
      // For documents (PDF, DOC, DOCX), use base64 upload with data URI
      if (resourceType === 'raw') {
        const mimeType = file.mimetype || 'application/octet-stream';
        const base64Data = file.buffer.toString('base64');
        const dataUri = `data:${mimeType};base64,${base64Data}`;
        
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: `falcon-security/${folder}`,
          resource_type: 'raw',
          public_id: uniqueId + ext,
        });
        
        console.log(`✅ Cloudinary upload successful: ${result.secure_url}`);
        return result.secure_url;
      }

      // For images, use stream upload
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `falcon-security/${folder}`,
            resource_type: resourceType,
            public_id: uniqueId,
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error) {
              console.error("❌ Cloudinary upload error:", error);
              reject(
                new BadRequestException(
                  `Cloudinary upload failed: ${error.message}`,
                ),
              );
            } else if (result) {
              console.log(
                `✅ Cloudinary upload successful: ${result.secure_url}`,
              );
              resolve(result.secure_url);
            } else {
              reject(
                new BadRequestException("Cloudinary upload returned no result"),
              );
            }
          },
        );

        // Write buffer to upload stream
        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error("❌ Cloudinary upload error:", error);
      throw new BadRequestException(
        `Cloudinary upload failed: ${(error as Error).message}`,
      );
    }
  }

  private async uploadToLocalStorage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
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

    // Validate file buffer exists (from memory storage)
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("File buffer is empty");
    }

    try {
      fs.writeFileSync(filepath, file.buffer);
      console.log(
        `✅ File saved successfully: ${filepath} (${file.buffer.length} bytes)`,
      );
    } catch (err) {
      console.error(`❌ Failed to save file: ${filepath}`, err);
      throw new BadRequestException(
        `Failed to write file: ${(err as Error)?.message}`,
      );
    }

    // Return URL path (accessible via static serve)
    return `${this.appUrl}/uploads/${folder}/${filename}`;
  }

  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    if (this.useCloudinary && publicIdOrUrl.includes("cloudinary.com")) {
      try {
        // Extract public_id from URL
        const urlParts = publicIdOrUrl.split("/");
        const fileWithExt = urlParts[urlParts.length - 1];
        const folderPath = urlParts
          .slice(urlParts.indexOf("falcon-security"))
          .join("/");
        const publicId = folderPath.replace(/\.[^/.]+$/, ""); // Remove extension

        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Cloudinary delete result: ${result.result}`);
        return result.result === "ok";
      } catch (error) {
        console.error("❌ Cloudinary delete error:", error);
        return false;
      }
    }
    // For local storage, we could implement file deletion
    return false;
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = "portfolio",
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.uploadImage(file, folder),
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new BadRequestException("Failed to upload images");
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
