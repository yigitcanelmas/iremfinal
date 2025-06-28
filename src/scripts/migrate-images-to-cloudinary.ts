import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { uploadToCloudinary } from '../lib/cloudinary';
import dbConnect from '../lib/mongodb';
import Property from '../models/Property';

async function migrateImagesToCloudinary() {
  try {
    // MongoDB'ye bağlan
    await dbConnect();
    console.log('✓ MongoDB bağlantısı başarılı');

    // Uploads klasörünü oku
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'properties');
    const files = await readdir(uploadsDir);
    console.log(`${files.length} resim bulundu`);

    // Her resim için
    for (const file of files) {
      try {
        // Resmi oku
        const filePath = path.join(uploadsDir, file);
        const buffer = await readFile(filePath);
        
        // Cloudinary'ye yükle
        const cloudinaryUrl = await uploadToCloudinary(buffer, file.split('.')[0]);
        console.log(`✓ ${file} -> Cloudinary'ye yüklendi`);

        // MongoDB'deki ilgili ilanları güncelle
        const oldUrl = `/uploads/properties/${file}`;
        const result = await Property.updateMany(
          { images: oldUrl },
          { $set: { 'images.$': cloudinaryUrl } }
        );

        console.log(`✓ ${result.modifiedCount} ilan güncellendi`);
      } catch (error) {
        console.error(`✗ ${file} işlenirken hata:`, error);
      }
    }

    console.log('\n✅ Migration tamamlandı!');

  } catch (error) {
    console.error('Migration hatası:', error);
  } finally {
    process.exit(0);
  }
}

// Script'i çalıştır
migrateImagesToCloudinary();
