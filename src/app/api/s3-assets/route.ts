import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

interface S3Asset {
  id: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  format: string;
  lastModified: string;
  url: string;
  thumbnail?: string;
  tags: string[];
}

// Mock S3 data - replace with actual S3 SDK integration
const mockS3Assets: S3Asset[] = [
  {
    id: 'BEchooseitemswife4x530s14.02.24EN.mp4',
    name: 'Business Empire - Choose Items Wife',
    type: 'video',
    size: 3667000,
    format: 'MP4',
    lastModified: '2024-02-14T10:30:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['business', 'simulation', 'gameplay', 'demo']
  },
  {
    id: 'BEshipping16x919s11.08.23EN.mp4',
    name: 'Business Empire - Shipping Routes',
    type: 'video',
    size: 2883000,
    format: 'MP4',
    lastModified: '2023-08-11T14:20:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['business', 'shipping', 'strategy', 'management']
  },
  {
    id: 'BEupgradeisometricskiresort4x528s06.12.24EN.mp4',
    name: 'Business Empire - Ski Resort Upgrade',
    type: 'video',
    size: 4979000,
    format: 'MP4',
    lastModified: '2024-12-06T16:45:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['business', 'upgrade', 'isometric', 'resort']
  },
  {
    id: 'BEupgradeofficeisometricwoodfloor4x530s11.08.23EN.mp4',
    name: 'Business Empire - Office Upgrade',
    type: 'video',
    size: 3171000,
    format: 'MP4',
    lastModified: '2023-08-11T11:15:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['business', 'office', 'isometric', 'upgrade']
  },
  {
    id: 'Dominoes_hook_avatars_beach_4x5_20s_03.01.24_EN',
    name: 'Dominoes - Beach Hook',
    type: 'video',
    size: 4166000,
    format: 'MP4',
    lastModified: '2024-01-03T12:00:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['dominoes', 'beach', 'avatars', 'hook']
  },
  {
    id: 'Dominoes_hook_avatars_victory_4x5_20s_03.01.24_EN',
    name: 'Dominoes - Victory Celebration',
    type: 'video',
    size: 5058000,
    format: 'MP4',
    lastModified: '2024-01-03T13:30:00Z',
    url: '/api/placeholder/600/400',
    thumbnail: '/api/placeholder/300/200',
    tags: ['dominoes', 'victory', 'celebration', 'competitive']
  },
  // Add some mock images
  {
    id: 'solitaire_logo_1024x1024.png',
    name: 'Solitaire App Icon',
    type: 'image',
    size: 256000,
    format: 'PNG',
    lastModified: '2024-01-26T09:15:00Z',
    url: 'https://play-lh.googleusercontent.com/uMfsu3LiCkhB1qm-1mvumNQoKAvg9YTxM8HtMwFTwZYvWmZY7Cjuf61D0Ip_OMfTeA=w480-h960-rw',
    tags: ['solitaire', 'logo', 'icon', 'branding']
  },
  {
    id: 'business_empire_logo_512x512.png',
    name: 'Business Empire Logo',
    type: 'image',
    size: 128000,
    format: 'PNG',
    lastModified: '2024-01-20T14:45:00Z',
    url: 'https://play-lh.googleusercontent.com/5p5R79o9wVz4HS1duEDvN-H0T6Os023GAeussNks_2oBVfsp7JzNfz7otpYXyXx7DVJrUVLR8KRtEYz5OseyMw=s96-rw',
    tags: ['business', 'empire', 'logo', 'branding']
  },
  {
    id: 'game_screenshot_1280x720.jpg',
    name: 'Game Screenshot - Main Menu',
    type: 'image',
    size: 445000,
    format: 'JPG',
    lastModified: '2024-01-22T11:20:00Z',
    url: '/api/placeholder/600/400',
    tags: ['screenshot', 'ui', 'main-menu', 'interface']
  },
  {
    id: 'promotional_banner_1920x1080.png',
    name: 'Promotional Banner - Holiday Sale',
    type: 'image',
    size: 892000,
    format: 'PNG',
    lastModified: '2024-01-18T16:30:00Z',
    url: '/api/placeholder/600/400',
    tags: ['banner', 'promotion', 'holiday', 'marketing']
  }
];

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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAssetType(key: string): 'image' | 'video' {
  const ext = key.toLowerCase().split('.').pop() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'avi', 'mov', 'webm'].includes(ext)) return 'video';
  return key.includes('video') || key.includes('.mp4') ? 'video' : 'image';
}

function generateFriendlyName(key: string): string {
  const fileName = key.split('/').pop() || key;
  const nameWithoutExt = fileName.split('.')[0];
  
  if (nameWithoutExt.startsWith('generated_image_')) {
    const timestamp = nameWithoutExt.replace('generated_image_', '');
    return `Generated Image ${new Date(parseInt(timestamp)).toLocaleDateString()}`;
  }
  
  if (nameWithoutExt.startsWith('generated_video_')) {
    const timestamp = nameWithoutExt.replace('generated_video_', '');
    return `Generated Video ${new Date(parseInt(timestamp)).toLocaleDateString()}`;
  }
  
  return nameWithoutExt.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

async function getS3Objects(): Promise<S3Asset[]> {
  try {
    const s3Client = getS3Client();
    const command = new ListObjectsV2Command({
      Bucket: AWS_CONFIG.buckets.generated,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    const assets: S3Asset[] = response.Contents
      .filter(obj => obj.Key && obj.Size && obj.Size > 0)
      .map(obj => {
        const key = obj.Key!;
        const type = getAssetType(key);
        const format = key.split('.').pop()?.toUpperCase() || 'UNKNOWN';
        
        return {
          id: key,
          name: generateFriendlyName(key),
          type,
          size: obj.Size!,
          format,
          lastModified: obj.LastModified?.toISOString() || new Date().toISOString(),
          url: `/api/s3-assets/download?key=${encodeURIComponent(key)}`,
          thumbnail: type === 'image' ? `/api/s3-assets/download?key=${encodeURIComponent(key)}` : undefined,
          tags: [
            'generated',
            type,
            type === 'video' ? 'nova-reel' : 'nova-canvas',
            format.toLowerCase()
          ],
          formattedSize: formatFileSize(obj.Size!),
          createdAt: obj.LastModified?.toISOString() || new Date().toISOString()
        };
      })
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    return assets;
  } catch (error) {
    console.error('Error fetching S3 objects:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'image' or 'video' or 'all'
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Try to get real S3 assets first, fallback to mock data
    let allAssets: S3Asset[];
    try {
      const s3Assets = await getS3Objects();
      allAssets = s3Assets.length > 0 ? s3Assets : mockS3Assets;
    } catch (s3Error) {
      console.warn('Failed to fetch S3 assets, using mock data:', s3Error);
      allAssets = mockS3Assets;
    }

    let filteredAssets = [...allAssets];

    // Filter by type
    if (type && type !== 'all') {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by last modified (newest first)
    filteredAssets.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

    // Paginate
    const paginatedAssets = filteredAssets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedAssets,
      metadata: {
        total: filteredAssets.length,
        limit,
        offset,
        totalImages: allAssets.filter(a => a.type === 'image').length,
        totalVideos: allAssets.filter(a => a.type === 'video').length,
        totalSize: allAssets.reduce((sum, asset) => sum + asset.size, 0),
        usingS3: allAssets !== mockS3Assets
      }
    });

  } catch (error) {
    console.error('S3 Assets API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch S3 assets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Real AWS S3 SDK integration implemented above ✅