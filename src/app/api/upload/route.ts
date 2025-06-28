import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'irem-users'; // Varsayılan olarak users klasörü

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya tipini kontrol et
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Geçersiz dosya tipi. Sadece JPEG, PNG, GIF ve WEBP formatları desteklenir.' },
        { status: 400 }
      );
    }

    // Dosya boyutunu kontrol et (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Dosya boyutu çok büyük. Maksimum 10MB desteklenir.' },
        { status: 400 }
      );
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}`;

    // Dosyayı buffer'a çevir
    const buffer = Buffer.from(await file.arrayBuffer());

    // Cloudinary'ye yükle
    const cloudinaryUrl = await uploadToCloudinary(buffer, fileName, folder);

    return NextResponse.json({ 
      url: cloudinaryUrl,
      success: true 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Dosya yüklenemedi' },
      { status: 500 }
    );
  }
}
