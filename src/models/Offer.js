import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an offer title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Please provide a discount percentage'],
    min: 0,
    max: 100,
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  backgroundImage: {
    type: String, // URL or Base64
    default: null,
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

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
