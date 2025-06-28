import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  // Temel Bilgiler
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  alternativePhone: {
    type: String,
    default: ''
  },
  
  // Müşteri Tipi ve Durumu
  customerType: {
    type: String,
    enum: ['lead', 'prospect', 'active_client', 'past_client'],
    default: 'lead'
  },
  leadSource: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'advertisement', 'walk_in', 'phone_call', 'other'],
    default: 'website'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Adres Bilgileri
  address: {
    street: String,
    district: String,
    city: String,
    state: String,
    country: { type: String, default: 'TR' },
    postalCode: String
  },
  
  // Emlak Tercihleri
  propertyPreferences: {
    type: {
      type: String,
      enum: ['sale', 'rent', 'both'],
      default: 'sale'
    },
    categories: [{
      main: {
        type: String,
        enum: ['Konut', 'İş Yeri', 'Arsa', 'Bina', 'Turistik Tesis', 'Devremülk']
      },
      sub: String
    }],
    budgetMin: Number,
    budgetMax: Number,
    preferredLocations: [{
      city: String,
      district: String,
      neighborhood: String
    }],
    roomRequirement: {
      type: String,
      enum: [
        'Stüdyo', '1+0', '1+1', '2+0', '2+1', '3+1', '3+2',
        '4+1', '4+2', '5+1', '5+2', '6+ Oda'
      ]
    },
    sizeMin: Number,
    sizeMax: Number,
    features: [{
      type: String,
      enum: [
        'hasElevator', 'hasCarPark', 'hasPool', 'hasGym', 'hasSecurity',
        'hasBalcony', 'hasTerrace', 'hasGarden', 'hasSeaView', 'hasCityView'
      ]
    }]
  },
  
  // Atanmış Temsilci
  assignedAgent: {
    agentId: String,
    agentName: String,
    assignedDate: { type: Date, default: Date.now }
  },
  
  // İletişim Geçmişi Özeti
  communicationSummary: {
    lastContactDate: Date,
    totalInteractions: { type: Number, default: 0 },
    lastInteractionType: {
      type: String,
      enum: ['phone', 'email', 'meeting', 'whatsapp', 'sms', 'site_visit']
    },
    nextFollowUpDate: Date
  },
  
  // İlgilenilen Emlaklar
  interestedProperties: [{
    propertyId: String,
    propertyTitle: String,
    interestLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    addedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['interested', 'viewed', 'offered', 'rejected', 'purchased'],
      default: 'interested'
    },
    notes: String
  }],
  
  // Notlar ve Etiketler
  notes: String,
  tags: [String],
  
  // Sistem Bilgileri
  createdBy: {
    userId: String,
    userName: String
  },
  lastUpdatedBy: {
    userId: String,
    userName: String
  },
  
  // Tarihler
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// İndeksler
CustomerSchema.index({ email: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ customerType: 1 });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ 'assignedAgent.agentId': 1 });
CustomerSchema.index({ 'address.city': 1 });
CustomerSchema.index({ 'address.district': 1 });
CustomerSchema.index({ createdAt: -1 });
CustomerSchema.index({ 'communicationSummary.lastContactDate': -1 });
CustomerSchema.index({ 'communicationSummary.nextFollowUpDate': 1 });

// Text search için
CustomerSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  notes: 'text'
});

// Middleware - güncelleme zamanını otomatik ayarla
CustomerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
