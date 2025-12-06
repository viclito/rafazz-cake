import mongoose from 'mongoose';

const HomeImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  label: {
    type: String,
    required: [true, 'Please provide a label'],
    trim: true,
  },
  imageData: {
    type: String, // Base64 encoded image or URL
    required: [true, 'Please provide image data'],
  },
  linkTo: {
    type: String,
    default: '/menu',
  },
  linkText: {
    type: String,
    default: 'Learn more',
  },
  position: {
    type: Number,
    required: true,
    default: 0,
  },
  cardType: {
    type: String,
    enum: ['regular', 'large', 'tall'],
    default: 'regular',
  },
  gradient: {
    type: String,
    default: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.HomeImage || mongoose.model('HomeImage', HomeImageSchema);
