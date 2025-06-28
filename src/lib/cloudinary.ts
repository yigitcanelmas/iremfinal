import { v2 as cloudinary } from 'cloudinary';

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Resim yükleme fonksiyonu
export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
  folder: string = 'irem-properties'
): Promise<string> {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          public_id: fileName,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Maksimum boyut sınırı
            { quality: 'auto' }, // Otomatik kalite optimizasyonu
            { format: 'auto' } // Otomatik format optimizasyonu (WebP vs JPEG)
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Resim yüklenemedi');
  }
}

// Resim silme fonksiyonu
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

// URL'den public ID çıkarma fonksiyonu
export function extractPublicIdFromUrl(url: string): string {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  return fileName.split('.')[0];
}
