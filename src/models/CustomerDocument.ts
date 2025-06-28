import mongoose from 'mongoose';

const CustomerDocumentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  
  // Müşteri Bilgileri
  customerId: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  customerName: {
    type: String,
    required: true
  },
  
  // Doküman Bilgileri
  documentType: {
    type: String,
    required: true,
    enum: [
      'identity_document',      // Kimlik belgesi
      'income_certificate',     // Gelir belgesi
      'bank_statement',         // Banka ekstresi
      'employment_letter',      // İş belgesi
      'tax_declaration',        // Vergi beyannamesi
      'property_deed',          // Tapu belgesi
      'mortgage_document',      // İpotek belgesi
      'insurance_policy',       // Sigorta poliçesi
      'contract_draft',         // Sözleşme taslağı
      'signed_contract',        // İmzalı sözleşme
      'payment_receipt',        // Ödeme makbuzu
      'property_valuation',     // Ekspertiz raporu
      'inspection_report',      // Muayene raporu
      'authorization_letter',   // Vekalet belgesi
      'power_of_attorney',      // Vekaletname
      'marriage_certificate',   // Evlilik cüzdanı
      'divorce_decree',         // Boşanma kararı
      'inheritance_document',   // Miras belgesi
      'court_decision',         // Mahkeme kararı
      'notary_document',        // Noterlik belgesi
      'other'                   // Diğer
    ]
  },
  
  title: {
    type: String,
    required: true
  },
  
  description: String,
  
  // Dosya Bilgileri
  fileName: {
    type: String,
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: Number, // bytes
  mimeType: String,
  fileExtension: String,
  
  // Doküman Durumu
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'rejected', 'expired', 'archived'],
    default: 'pending_review'
  },
  
  // Onay Bilgileri
  reviewedBy: {
    userId: String,
    userName: String,
    reviewDate: Date,
    reviewNotes: String
  },
  
  // Emlak İlişkisi
  relatedProperty: {
    propertyId: String,
    propertyTitle: String,
    propertyType: {
      type: String,
      enum: ['sale', 'rent']
    }
  },
  
  // İşlem İlişkisi
  relatedTransaction: {
    transactionId: String,
    transactionType: {
      type: String,
      enum: ['sale', 'rent', 'valuation', 'consultation']
    }
  },
  
  // Geçerlilik Tarihleri
  validFrom: Date,
  validUntil: Date,
  isExpired: {
    type: Boolean,
    default: false
  },
  
  // Güvenlik ve Erişim
  accessLevel: {
    type: String,
    enum: ['public', 'internal', 'confidential', 'restricted'],
    default: 'internal'
  },
  
  // Doküman versiyonlama
  version: {
    type: Number,
    default: 1
  },
  parentDocumentId: String, // Önceki versiyon referansı
  
  // Etiketler ve Kategoriler
  tags: [String],
  category: String,
  
  // Yükleyen Kişi
  uploadedBy: {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userRole: String
  },
  
  // Son Güncelleme
  lastModifiedBy: {
    userId: String,
    userName: String
  },
  
  // Notlar
  notes: String,
  
  // Sistem Bilgileri
  ipAddress: String,
  userAgent: String,
  
  // Tarihler
  uploadDate: {
    type: Date,
    default: Date.now
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// İndeksler
CustomerDocumentSchema.index({ customerId: 1 });
CustomerDocumentSchema.index({ documentType: 1 });
CustomerDocumentSchema.index({ status: 1 });
CustomerDocumentSchema.index({ uploadDate: -1 });
CustomerDocumentSchema.index({ validUntil: 1 });
CustomerDocumentSchema.index({ isExpired: 1 });
CustomerDocumentSchema.index({ 'uploadedBy.userId': 1 });
CustomerDocumentSchema.index({ 'relatedProperty.propertyId': 1 });
CustomerDocumentSchema.index({ accessLevel: 1 });
CustomerDocumentSchema.index({ createdAt: -1 });

// Compound indexes
CustomerDocumentSchema.index({ customerId: 1, documentType: 1 });
CustomerDocumentSchema.index({ customerId: 1, uploadDate: -1 });
CustomerDocumentSchema.index({ status: 1, validUntil: 1 });

// Text search için
CustomerDocumentSchema.index({
  title: 'text',
  description: 'text',
  originalFileName: 'text',
  notes: 'text'
});

// Middleware - güncelleme zamanını otomatik ayarla
CustomerDocumentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Geçerlilik kontrolü
  if (this.validUntil && new Date() > this.validUntil) {
    this.isExpired = true;
  }
  
  next();
});

// Virtual field - dosya boyutunu human readable format'ta döndür
CustomerDocumentSchema.virtual('fileSizeFormatted').get(function() {
  if (!this.fileSize) return 'Bilinmiyor';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

export default mongoose.models.CustomerDocument || mongoose.model('CustomerDocument', CustomerDocumentSchema);
