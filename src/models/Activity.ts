import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: false // userEmail opsiyonel yaptık
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  targetType: { // category yerine targetType kullanıyoruz
    type: String,
    required: false,
    enum: ['user', 'property', 'system', 'auth', 'customer']
  },
  targetId: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failed', 'warning']
  },
  details: { // metadata yerine details kullanıyoruz
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
