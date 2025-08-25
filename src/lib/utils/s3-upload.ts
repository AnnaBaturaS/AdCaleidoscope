import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Configuration
const S3_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  bucket: process.env.S3_BUCKET_NAME || 'adalchemy-assets',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

// Initialize S3 Client
const s3Client = new S3Client({
  region: S3_CONFIG.region,
  credentials: S3_CONFIG.accessKeyId && S3_CONFIG.secretAccessKey ? {
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
  } : undefined,
});

export interface UploadOptions {
  fileName: string;
  fileType: string;
  fileSize: number;
  folder?: string;
  metadata?: Record<string, string>;
  expiresIn?: number; // in seconds, default 3600 (1 hour)
}

export interface PresignedUploadResult {
  uploadUrl: string;
  fileUrl: string;
  key: string;
  bucket: string;
}

// Generate presigned URL for upload
export async function generatePresignedUploadUrl(
  options: UploadOptions
): Promise<PresignedUploadResult> {
  const { fileName, fileType, folder = 'uploads', metadata, expiresIn = 3600 } = options;
  
  // Generate unique file key
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}_${randomString}_${sanitizedFileName}`;
  
  // Create upload command
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
    ContentType: fileType,
    Metadata: {
      originalName: fileName,
      uploadTime: new Date().toISOString(),
      ...metadata,
    },
  });
  
  try {
    // Generate presigned URL
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
    
    // Construct public file URL
    const fileUrl = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
    
    return {
      uploadUrl,
      fileUrl,
      key,
      bucket: S3_CONFIG.bucket,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

// Generate presigned URL for download
export async function generatePresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
  });
  
  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating presigned download URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

// Upload file directly (for server-side uploads)
export async function uploadFile(
  file: Buffer | Uint8Array,
  options: UploadOptions
): Promise<string> {
  const { fileName, fileType, folder = 'uploads', metadata } = options;
  
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}_${randomString}_${sanitizedFileName}`;
  
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: key,
    Body: file,
    ContentType: fileType,
    Metadata: {
      originalName: fileName,
      uploadTime: new Date().toISOString(),
      ...metadata,
    },
  });
  
  try {
    await s3Client.send(command);
    return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

// Utility functions for file management
export const S3Utils = {
  // Get file extension from filename
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },
  
  // Validate file type
  isValidFileType(fileName: string, allowedTypes: string[]): boolean {
    const extension = this.getFileExtension(fileName);
    return allowedTypes.includes(extension);
  },
  
  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // Validate file size
  isValidFileSize(fileSize: number, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
  },
  
  // Generate thumbnail key for images
  generateThumbnailKey(originalKey: string, size: string = 'small'): string {
    const parts = originalKey.split('.');
    const extension = parts.pop();
    const baseName = parts.join('.');
    return `${baseName}_thumb_${size}.${extension}`;
  },
  
  // Parse S3 URL to get key
  parseS3Url(url: string): { bucket: string; key: string } | null {
    const s3UrlPattern = /https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)/;
    const match = url.match(s3UrlPattern);
    
    if (match) {
      return {
        bucket: match[1],
        key: match[3],
      };
    }
    
    return null;
  },
};

// File type configurations
export const FILE_CONFIGS = {
  images: {
    allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxSize: 10, // MB
    folder: 'images',
  },
  videos: {
    allowedTypes: ['mp4', 'avi', 'mov', 'wmv', 'flv'],
    maxSize: 100, // MB
    folder: 'videos',
  },
  playables: {
    allowedTypes: ['zip', 'html'],
    maxSize: 50, // MB
    folder: 'playables',
  },
  documents: {
    allowedTypes: ['pdf', 'doc', 'docx', 'txt'],
    maxSize: 20, // MB
    folder: 'documents',
  },
  audio: {
    allowedTypes: ['mp3', 'wav', 'ogg', 'aac'],
    maxSize: 25, // MB
    folder: 'audio',
  },
};

// Error types
export class S3UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'S3UploadError';
  }
}

// Validation functions
export function validateUpload(
  fileName: string,
  fileSize: number,
  fileType: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Determine file category
  let config = FILE_CONFIGS.documents; // default
  const extension = S3Utils.getFileExtension(fileName);
  
  if (FILE_CONFIGS.images.allowedTypes.includes(extension)) {
    config = FILE_CONFIGS.images;
  } else if (FILE_CONFIGS.videos.allowedTypes.includes(extension)) {
    config = FILE_CONFIGS.videos;
  } else if (FILE_CONFIGS.playables.allowedTypes.includes(extension)) {
    config = FILE_CONFIGS.playables;
  } else if (FILE_CONFIGS.audio.allowedTypes.includes(extension)) {
    config = FILE_CONFIGS.audio;
  }
  
  // Validate file type
  if (!S3Utils.isValidFileType(fileName, config.allowedTypes)) {
    errors.push(`File type .${extension} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }
  
  // Validate file size
  if (!S3Utils.isValidFileSize(fileSize, config.maxSize)) {
    errors.push(`File size ${S3Utils.formatFileSize(fileSize)} exceeds maximum allowed size of ${config.maxSize}MB`);
  }
  
  // Validate filename
  if (fileName.length > 255) {
    errors.push('Filename is too long (maximum 255 characters)');
  }
  
  if (!/^[a-zA-Z0-9._-]+$/.test(fileName.replace(/\s/g, '_'))) {
    errors.push('Filename contains invalid characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Batch upload utilities
export async function generateBatchPresignedUrls(
  files: { fileName: string; fileType: string; fileSize: number }[]
): Promise<PresignedUploadResult[]> {
  const results: PresignedUploadResult[] = [];
  
  for (const file of files) {
    try {
      const result = await generatePresignedUploadUrl(file);
      results.push(result);
    } catch (error) {
      throw new S3UploadError(
        `Failed to generate upload URL for ${file.fileName}`,
        'BATCH_UPLOAD_FAILED',
        { fileName: file.fileName, error }
      );
    }
  }
  
  return results;
}

// Progress tracking for uploads
export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export class UploadProgressTracker {
  private progressMap = new Map<string, UploadProgress>();
  private listeners: ((progress: UploadProgress[]) => void)[] = [];
  
  addFile(fileName: string) {
    this.progressMap.set(fileName, {
      fileName,
      progress: 0,
      status: 'pending',
    });
    this.notifyListeners();
  }
  
  updateProgress(fileName: string, progress: number, status: UploadProgress['status'], error?: string) {
    const current = this.progressMap.get(fileName);
    if (current) {
      current.progress = progress;
      current.status = status;
      current.error = error;
      this.notifyListeners();
    }
  }
  
  onProgress(listener: (progress: UploadProgress[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  private notifyListeners() {
    const progress = Array.from(this.progressMap.values());
    this.listeners.forEach(listener => listener(progress));
  }
  
  clear() {
    this.progressMap.clear();
    this.notifyListeners();
  }
  
  getProgress(): UploadProgress[] {
    return Array.from(this.progressMap.values());
  }
}