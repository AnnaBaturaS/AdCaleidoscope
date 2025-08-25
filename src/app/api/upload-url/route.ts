import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedUploadUrl, validateUpload } from '@/lib/utils/s3-upload';

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileSize, folder, metadata } = await request.json();

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: fileName, fileType, fileSize'
      }, { status: 400 });
    }

    // Validate file upload
    const validation = validateUpload(fileName, fileSize, fileType);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'File validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    // Generate presigned URL
    const result = await generatePresignedUploadUrl({
      fileName,
      fileType,
      fileSize,
      folder,
      metadata
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Upload URL generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate upload URL'
    }, { status: 500 });
  }
}