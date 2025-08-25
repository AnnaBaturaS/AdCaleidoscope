import { NextRequest, NextResponse } from 'next/server';
import creativesData from '../../../../public/data/creatives.json';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const format = searchParams.get('format');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  // Используем данные напрямую из JSON файла
  let filteredCreatives = [...creativesData];

  // Простая фильтрация если нужна
  if (format && format !== 'all') {
    // В JSON файле нет поля format, так что пропускаем
  }

  const paginatedCreatives = filteredCreatives.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedCreatives,
    total: filteredCreatives.length,
    limit,
    offset
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Простое добавление нового креатива
    const newCreative = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: newCreative
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request data'
    }, { status: 400 });
  }
}