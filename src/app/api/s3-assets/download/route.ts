import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const AWS_CONFIG = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  buckets: {
    generated: process.env.S3_BUCKET_GENERATED || 'creativeos-generated',
  }
};

const getS3Client = () => {
  const credentials = AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey ? {
    accessKeyId: AWS_CONFIG.accessKeyId,
    secretAccessKey: AWS_CONFIG.secretAccessKey,
  } : undefined;
  
  return new S3Client({
    region: AWS_CONFIG.region,
    credentials
  });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Missing key parameter' },
        { status: 400 }
      );
    }

    const s3Client = getS3Client();
    
    // Generate a signed URL for the S3 object
    const command = new GetObjectCommand({
      Bucket: AWS_CONFIG.buckets.generated,
      Key: key
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    
    // Redirect to the signed URL
    return NextResponse.redirect(signedUrl);
    
  } catch (error) {
    console.error('Error downloading S3 asset:', error);
    
    // Fallback to placeholder for demo purposes
    return NextResponse.redirect('/api/placeholder/600/400');
  }
}