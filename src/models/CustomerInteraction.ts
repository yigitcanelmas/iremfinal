import mongoose from 'mongoose';

const CustomerInteractionSchema = new mongoose.Schema({
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
  customerEmail: String,
  customerPhone: String,
  
  // İletişim Detayları
  interactionType: {
    type: String,
    required: true,
    enum: [
      'phone_call_incoming',
      'phone_call_outgoing', 
      'email_sent',
      'email_received',
      'meeting_office',
      'meeting_property',
      'whatsapp_message',
      'sms_sent',
      'site_visit',
      'property_showing',
      'contract_signing',
      'follow_up_call',
      'complaint',
      'feedback',
      'other'
    ]
  },
  
  subject: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  // İletişim Sonucu
  outcome: {
    type: String,
    enum: [
      'successful',
      'no_answer',
      'busy',
      'callback_requested',
      'meeting_scheduled',
      'property_visit_scheduled',
      'offer_made',
      'offer_accepted',
      'offer_rejected',
      'contract_signed',
      'deal_closed',
      'lost_opportunity',
      'follow_up_needed'
    ]
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
  
  // Takip Bilgileri
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,
  
  // Dosya Ekleri
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // İletişim Süresi (dakika)
  duration: Number,
  
  // Temsilci Bilgileri
  agentId: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  
  // Müşteri Memnuniyeti
  customerSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  
  // Sistem Bilgileri
  ipAddress: String,
  userAgent: String,
  
  // Tarihler
  interactionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// İndeksler
CustomerInteractionSchema.index({ customerId: 1 });
CustomerInteractionSchema.index({ agentId: 1 });
CustomerInteractionSchema.index({ interactionType: 1 });
CustomerInteractionSchema.index({ interactionDate: -1 });
CustomerInteractionSchema.index({ followUpDate: 1 });
CustomerInteractionSchema.index({ outcome: 1 });
CustomerInteractionSchema.index({ 'relatedProperty.propertyId': 1 });
CustomerInteractionSchema.index({ createdAt: -1 });

// Compound indexes
CustomerInteractionSchema.index({ customerId: 1, interactionDate: -1 });
CustomerInteractionSchema.index({ agentId: 1, interactionDate: -1 });
CustomerInteractionSchema.index({ followUpRequired: 1, followUpDate: 1 });

// Text search için
CustomerInteractionSchema.index({
  subject: 'text',
  description: 'text',
  followUpNotes: 'text'
});

// Middleware - güncelleme zamanını otomatik ayarla
CustomerInteractionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.CustomerInteraction || mongoose.model('CustomerInteraction', CustomerInteractionSchema);
