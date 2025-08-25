import { NextResponse } from 'next/server';

export async function GET() {
  const ngrokUrl = process.env.NGROK_URL || process.env.NEXT_PUBLIC_NGROK_URL;
  
  if (!ngrokUrl) {
    return NextResponse.json(
      { error: 'Ngrok tunnel not established' },
      { status: 503 }
    );
  }

  return NextResponse.json({
    url: ngrokUrl,
    status: 'active'
  });
}