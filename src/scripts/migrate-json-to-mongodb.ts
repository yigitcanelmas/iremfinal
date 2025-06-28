import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://iworld:3PKMpj3aUWTHqx8b@cluster0.otx2ycs.mongodb.net/iworld';

// Property Schema
const propertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['sale', 'rent'] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    country: { type: String, default: 'TR' },
    city: { type: String, required: true },
    district: { type: String },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specs: {
    size: { type: Number, required: true },
    rooms: { type: String, required: true },
    bathrooms: { type: Number, required: true },
    age: { type: Number, required: true },
    furnishing: { type: String, enum: ['Furnished', 'Unfurnished', 'Partially Furnished'] },
    grossArea: Number,
    netArea: Number
  },
  features: [String],
  buildingFeatures: {
    floor: String,
    totalFloors: Number,
    hasParking: Boolean,
    hasElevator: Boolean,
    hasSecurity: Boolean,
    hasPool: Boolean,
    hasGym: Boolean
  },
  propertyDetails: {
    heatingType: String,
    hasBalcony: Boolean,
    inSite: Boolean
  },
  images: [String],
  agent: {
    name: { type: String, required: false },
    company: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false }
  },
  virtualTour: String,
  sahibindenLink: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

async function migrateData() {
  try {
    console.log('MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı!');

    // Mevcut verileri temizle
    await Property.deleteMany({});
    console.log('Mevcut veriler temizlendi.');

    // Sale verilerini yükle
    const saleDataPath = path.join(__dirname, '../data/sale.json');
    if (fs.existsSync(saleDataPath)) {
      const saleData = JSON.parse(fs.readFileSync(saleDataPath, 'utf8'));
      console.log(`${saleData.length} satılık emlak verisi bulundu.`);
      
      for (const property of saleData) {
        const propertyData = {
          ...property,
          type: 'sale',
          id: property.id || `PROP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          location: {
            country: 'TR',
            city: property.location?.city || 'İstanbul',
            district: property.location?.district,
            coordinates: property.location?.coordinates
          },
          buildingFeatures: {
            hasParking: property.buildingFeatures?.hasParking || false,
            hasElevator: property.buildingFeatures?.hasElevator || false,
            hasSecurity: property.buildingFeatures?.hasSecurity || false,
            hasPool: property.buildingFeatures?.hasPool || false,
            hasGym: property.buildingFeatures?.hasGym || false,
            floor: property.buildingFeatures?.floor,
            totalFloors: property.buildingFeatures?.totalFloors
          },
          propertyDetails: {
            heatingType: property.propertyDetails?.heatingType,
            hasBalcony: property.features?.includes('Balkon') || false,
            inSite: property.buildingFeatures?.hasSecurity || false
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await Property.create(propertyData);
      }
      console.log('Satılık emlak verileri başarıyla aktarıldı.');
    }

    // Rent verilerini yükle
    const rentDataPath = path.join(__dirname, '../data/rent.json');
    if (fs.existsSync(rentDataPath)) {
      const rentData = JSON.parse(fs.readFileSync(rentDataPath, 'utf8'));
      console.log(`${rentData.length} kiralık emlak verisi bulundu.`);
      
      for (const property of rentData) {
        const propertyData = {
          ...property,
          type: 'rent',
          id: property.id || `PROP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          location: {
            country: 'TR',
            city: property.location?.city || 'İstanbul',
            district: property.location?.district,
            coordinates: property.location?.coordinates
          },
          buildingFeatures: {
            hasParking: property.buildingFeatures?.hasParking || false,
            hasElevator: property.buildingFeatures?.hasElevator || false,
            hasSecurity: property.buildingFeatures?.hasSecurity || false,
            hasPool: property.buildingFeatures?.hasPool || false,
            hasGym: property.buildingFeatures?.hasGym || false,
            floor: property.buildingFeatures?.floor,
            totalFloors: property.buildingFeatures?.totalFloors
          },
          propertyDetails: {
            heatingType: property.propertyDetails?.heatingType,
            hasBalcony: property.features?.includes('Balkon') || false,
            inSite: property.buildingFeatures?.hasSecurity || false
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await Property.create(propertyData);
      }
      console.log('Kiralık emlak verileri başarıyla aktarıldı.');
    }

    // Toplam veri sayısını kontrol et
    const totalCount = await Property.countDocuments();
    console.log(`Toplam ${totalCount} emlak verisi MongoDB'ye aktarıldı.`);

    await mongoose.disconnect();
    console.log('MongoDB bağlantısı kapatıldı.');
    
  } catch (error) {
    console.error('Veri aktarım hatası:', error);
    process.exit(1);
  }
}

migrateData();
