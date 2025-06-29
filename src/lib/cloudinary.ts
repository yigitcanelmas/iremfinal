import { v2 as cloudinary } from 'cloudinary';

// Environment variables kontrolü
const requiredEnvVars = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Eksik environment variables kontrolü
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `CLOUDINARY_${key.toUpperCase()}`);

if (missingVars.length > 0) {
  console.error('Missing Cloudinary environment variables:', missingVars);
}

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: requiredEnvVars.cloud_name,
  api_key: requiredEnvVars.api_key,
  api_secret: requiredEnvVars.api_secret,
});

export default cloudinary;

// Resim yükleme fonksiyonu
export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
  folder: string = 'irem-properties'
): Promise<string> {
  try {
    // Environment variables kontrolü
    if (missingVars.length > 0) {
      console.warn('Cloudinary environment variables missing, using fallback method');
      // Fallback: Local storage simulation for development
      const fallbackUrl = `/uploads/properties/${fileName}.jpg`;
      console.log('Using fallback URL:', fallbackUrl);
      return fallbackUrl;
    }

    console.log('Starting Cloudinary upload:', {
      fileName,
      folder,
      bufferSize: file.length,
      cloudName: requiredEnvVars.cloud_name
    });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: folder,
          public_id: fileName,
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ],
          timeout: 60000 // 60 saniye timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload stream error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result?.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(file);
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error('Cloudinary upload error details:', error);
    
    // Fallback durumunda local URL döndür
    const fallbackUrl = `/uploads/properties/${fileName}.jpg`;
    console.log('Cloudinary failed, using fallback URL:', fallbackUrl);
    
    if (error instanceof Error) {
      console.warn(`Cloudinary yükleme hatası: ${error.message}, fallback kullanılıyor`);
    }
    
    return fallbackUrl;
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
