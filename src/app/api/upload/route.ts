import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const id = formData.get('id') as string;

    if (!file || !id) {
      return NextResponse.json({ error: "File dan ID diperlukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dapatkan ekstensi file
    const extension = file.name.split('.').pop() || 'jpg';

    // Buat nama file yang unik dengan ID dan timestamp
    const fileName = `${id}-${Date.now()}.${extension}`;

    // Pastikan direktori uploads ada
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    try {
      await writeFile(`${uploadDir}/${fileName}`, buffer);
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json({ error: "Gagal menyimpan file" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}

// Atur ukuran maksimal file yang bisa diupload (10MB)
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};