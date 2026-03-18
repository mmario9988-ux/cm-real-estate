import { NextResponse } from 'next/server';
import { corsResponse, corsOptions } from '@/lib/cors';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return corsResponse({ error: "No file provided" }, 400);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueId}-${file.name.replace(/\s+/g, '-')}`;
    
    // Path to save - ensure public/uploads exists
    const publicPath = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(publicPath, filename);

    // Write file
    await writeFile(filePath, buffer);

    // Return the local URL
    const imageUrl = `/uploads/${filename}`;

    return corsResponse({
      url: imageUrl,
      name: file.name,
      size: file.size
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return corsResponse({ error: error.message || "Upload failed" }, 500);
  }
}

export async function OPTIONS() {
  return corsOptions();
}
