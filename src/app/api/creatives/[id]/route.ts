import { NextRequest, NextResponse } from 'next/server';
import { Creative } from '@/models/creative';

const mockCreative: Creative = {
  id: '1',
  name: 'Adventure Quest - Hero Intro',
  format: 'video',
  urls: {
    preview: '/api/placeholder/600/400',
    source: '/assets/adventure-quest-hero-intro.mp4',
    thumbnail: '/api/placeholder/300/200'
  },
  tags: {
    hook: 'gameplay',
    style: 'bold',
    cta: 'play_now',
    color: 'blue',
    intro_pace: 'fast',
    lang: 'en',
    duration: 15,
    has_voiceover: true,
    has_text_overlay: true,
    brand_visibility: 'high'
  },
  version: 3,
  network: ['Facebook', 'Google', 'TikTok'],
  status: 'active',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:20:00Z',
  metrics: {
    impressions: 125000,
    clicks: 4750,
    installs: 567,
    ctr: 3.8,
    ipm: 45.2,
    cpi: 2.34,
    spend: 1327,
    cvr: 11.9,
    retention_d1: 68.5,
    retention_d7: 32.1
  },
  generatedFrom: 'brief-12',
  isVariation: false
};

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;

  await new Promise(resolve => setTimeout(resolve, 100));

  if (id === '1' || id === mockCreative.id) {
    return NextResponse.json({
      success: true,
      data: mockCreative
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Creative not found'
  }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const updates = await request.json();

    await new Promise(resolve => setTimeout(resolve, 200));

    if (id === '1' || id === mockCreative.id) {
      const updatedCreative = {
        ...mockCreative,
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
        version: mockCreative.version + 1
      };

      return NextResponse.json({
        success: true,
        data: updatedCreative
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Creative not found'
    }, { status: 404 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request data'
    }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = params;

  await new Promise(resolve => setTimeout(resolve, 100));

  if (id === '1' || id === mockCreative.id) {
    return NextResponse.json({
      success: true,
      message: 'Creative deleted successfully'
    });
  }

  return NextResponse.json({
    success: false,
    error: 'Creative not found'
  }, { status: 404 });
}