// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const id = formData.get('id') as string;

    if (!file || !id) {
      return NextResponse.json({ error: "File dan ID diperlukan" }, { status: 400 });
    }

    // Upload ke Vercel Blob Storage
    const blob = await put(`${id}-${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      success: true,
      fileName: blob.url
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};