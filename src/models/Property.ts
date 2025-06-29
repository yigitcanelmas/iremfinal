import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['sale', 'rent'] },
  category: {
    main: { 
      type: String,
      required: true,
      enum: ['Konut', 'İş Yeri', 'Arsa', 'Bina', 'Turistik Tesis', 'Devremülk']
    },
    sub: { type: String, required: true }
  },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    country: { type: String, default: 'TR' },
    state: String,
    city: { type: String, required: true },
    district: String,
    neighborhood: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  specs: {
    netSize: { type: Number, required: true },
    grossSize: Number,
    rooms: { 
      type: String, 
      required: true,
      enum: [
        'Stüdyo', '1+0', '1+1', '2+0', '2+1', '3+1', '3+2',
        '4+1', '4+2', '5+1', '5+2', '6+ Oda'
      ]
    },
    bathrooms: { type: Number, required: true },
    age: { type: Number, required: true },
    floor: Number,
    totalFloors: Number,
    heating: {
      type: String,
      enum: [
        'Kombi Doğalgaz', 'Merkezi Doğalgaz', 'Yerden Isıtma',
        'Merkezi (Pay Ölçer)', 'Klima', 'Şömine', 'Soba', 'Isıtma Yok'
      ]
    },
    furnishing: { 
      type: String, 
      enum: ['Furnished', 'Unfurnished', 'Partially Furnished']
    },
    balconyCount: Number
  },
  interiorFeatures: {
    kitchenType: { type: String, enum: ['Açık', 'Kapalı', 'Amerikan'] },
    hasBuiltInKitchen: Boolean,
    hasBuiltInWardrobe: Boolean,
    hasLaminate: Boolean,
    hasParquet: Boolean,
    hasCeramic: Boolean,
    hasMarble: Boolean,
    hasWallpaper: Boolean,
    hasPaintedWalls: Boolean,
    hasSpotLighting: Boolean,
    hasHiltonBathroom: Boolean,
    hasJacuzzi: Boolean,
    hasShowerCabin: Boolean,
    hasAmericanDoor: Boolean,
    hasSteelDoor: Boolean,
    hasIntercom: Boolean
  },
  exteriorFeatures: {
    hasBalcony: Boolean,
    hasTerrace: Boolean,
    hasGarden: Boolean,
    hasGardenUse: Boolean,
    hasSeaView: Boolean,
    hasCityView: Boolean,
    hasNatureView: Boolean,
    hasPoolView: Boolean,
    facade: {
      type: String,
      enum: ['Kuzey', 'Güney', 'Doğu', 'Batı', 'Güneydoğu', 'Güneybatı', 'Kuzeydoğu', 'Kuzeybatı']
    }
  },
  buildingFeatures: {
    hasElevator: Boolean,
    hasCarPark: Boolean,
    hasClosedCarPark: Boolean,
    hasOpenCarPark: Boolean,
    hasSecurity: Boolean,
    has24HourSecurity: Boolean,
    hasCameraSystem: Boolean,
    hasConcierge: Boolean,
    hasPool: Boolean,
    hasGym: Boolean,
    hasSauna: Boolean,
    hasTurkishBath: Boolean,
    hasPlayground: Boolean,
    hasBasketballCourt: Boolean,
    hasTennisCourt: Boolean,
    hasGenerator: Boolean,
    hasFireEscape: Boolean,
    hasFireDetector: Boolean,
    hasWaterBooster: Boolean,
    hasSatelliteSystem: Boolean,
    hasWifi: Boolean
  },
  propertyDetails: {
    usageStatus: {
      type: String,
      enum: ['Boş', 'Kiracılı', 'Mülk Sahibi', 'Yeni Yapılmış']
    },
    deedStatus: {
      type: String,
      enum: ['Kat Mülkiyeti', 'Kat İrtifakı', 'Arsa Tapulu', 'Hisseli Tapu', 'Müstakil Tapulu']
    },
    fromWho: {
      type: String,
      enum: ['Sahibinden', 'Emlak Ofisinden', 'Bankadan', 'Müteahhitten', 'Belediyeden']
    },
    isSettlement: Boolean,
    creditEligible: Boolean,
    exchangeAvailable: Boolean,
    inSite: Boolean,
    monthlyFee: Number,
    hasDebt: Boolean,
    debtAmount: Number,
    isRentGuaranteed: Boolean,
    rentGuaranteeAmount: Number,
    isNewBuilding: Boolean,
    isSuitableForOffice: Boolean,
    hasBusinessLicense: Boolean
  },
  // Arsa özel alanları
  landDetails: {
    zoningStatus: {
      type: String,
      enum: ['Tarla', 'İmarlı', 'Ticari İmarlı', 'Konut İmarlı', 'Sanayi İmarlı', 'Turizm İmarlı', 'Belirtilmemiş']
    },
    pricePerSquareMeter: Number, // m² Fiyatı
    blockNumber: String, // Ada No
    parcelNumber: String, // Parsel No
    sheetNumber: String, // Pafta No
    floorAreaRatio: String, // Kaks (Emsal)
    buildingHeight: String, // Gabari
    creditEligibility: {
      type: String,
      enum: ['Uygun', 'Uygun Değil', 'Bilinmiyor']
    }
  },
  images: [String],
  virtualTour: String,
  panoramicImages: [{
    url: String,
    title: String,
    hotspots: [{
      text: String,
      yaw: Number,
      pitch: Number
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  viewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isSponsored: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['active', 'passive', 'sold', 'rented'],
    default: 'active'
  },
  agent: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    photo: String,
    company: String,
    isOwner: Boolean
  },
  sahibindenLink: String,
  hurriyetEmlakLink: String,
  emlakJetLink: String
}, {
  timestamps: true
});

// İndeksler
propertySchema.index({ type: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ slug: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.district': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'specs.size': 1 });
propertySchema.index({ 'specs.rooms': 1 });
propertySchema.index({ createdAt: -1 });

// Text search için
propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text',
  'location.district': 'text'
});

// Geospatial index
propertySchema.index({ 'location.coordinates': '2dsphere' });

// Slug oluşturma middleware'i
propertySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('type') || !this.slug) {
    const typePrefix = this.type === 'sale' ? 'satilik-emlak' : 'kiralik-emlak';
    const titleSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-ğüşıöç]/g, '')
      .replace(/[ğ]/g, 'g')
      .replace(/[ü]/g, 'u')
      .replace(/[ş]/g, 's')
      .replace(/[ı]/g, 'i')
      .replace(/[ö]/g, 'o')
      .replace(/[ç]/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    this.slug = `${typePrefix}-${titleSlug}`;
  }
  next();
});

// Type assertion to fix TypeScript errors with Mongoose
const Property = (mongoose.models.Property || mongoose.model('Property', propertySchema)) as any;

export default Property;
