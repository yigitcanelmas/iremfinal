import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: {
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
  photo: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: 'Emlak Danışmanı'
  },
  specialization: {
    type: String,
    enum: ['Konut', 'Ticari', 'Arsa', 'Hepsi'],
    default: 'Hepsi'
  },
  experience: {
    type: Number,
    default: 0
  },
  languages: [{
    type: String
  }],
  about: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

agentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Agent || mongoose.model('Agent', agentSchema);
