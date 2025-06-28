import mongoose from 'mongoose';
import Property from '../models/Property';
import { readSaleProperties, readRentProperties } from '../lib/utils';

const MONGODB_URI = 'mongodb+srv://iworld:3PKMpj3aUWTHqx8b@cluster0.otx2ycs.mongodb.net/iworld?retryWrites=true&w=majority&authSource=admin';

async function migrateData() {
  try {
    console.log('MongoDB bağlantısı kuruluyor...');
    
    // Timeout ile bağlantı
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 saniye timeout
      socketTimeoutMS: 45000,
    });
    
    console.log('✓ MongoDB bağlantısı başarılı');
    
    console.log('Mevcut veriler temizleniyor...');
    await Property.deleteMany({});
    
    console.log('Satılık emlaklar yükleniyor...');
    const saleProperties = readSaleProperties();
    console.log(`${saleProperties.length} satılık emlak bulundu`);
    
    console.log('Kiralık emlaklar yükleniyor...');
    const rentProperties = readRentProperties();
    console.log(`${rentProperties.length} kiralık emlak bulundu`);
    
    const allProperties = [...saleProperties, ...rentProperties];
    
    console.log('Veriler MongoDB\'ye aktarılıyor...');
    for (const property of allProperties) {
      try {
        await Property.create(property);
        console.log(`✓ ${property.id} - ${property.title}`);
      } catch (error) {
        console.error(`✗ Hata: ${property.id} - ${error}`);
      }
    }
    
    console.log('\n✅ Migration tamamlandı!');
    console.log(`Toplam ${allProperties.length} emlak MongoDB'ye aktarıldı`);
    
    // Veritabanı istatistikleri
    const totalCount = await Property.countDocuments();
    const saleCount = await Property.countDocuments({ type: 'sale' });
    const rentCount = await Property.countDocuments({ type: 'rent' });
    
    console.log('\n📊 Veritabanı İstatistikleri:');
    console.log(`Toplam emlak: ${totalCount}`);
    console.log(`Satılık emlak: ${saleCount}`);
    console.log(`Kiralık emlak: ${rentCount}`);
    
  } catch (error) {
    console.error('Migration hatası:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateData();
