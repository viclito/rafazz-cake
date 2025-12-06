import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Cakes', 'Cupcakes', 'Pastries'],
  },
  price: {
    type: String,
    required: [true, 'Please provide a price'],
  },
  description: {
    type: String,
    default: '',
  },
  imageData: {
    type: String, // Base64 encoded image or URL
    default: null,
  },
  customizationOptions: [{
    name: { type: String, required: true }, // e.g., "Size", "Flavor"
    type: { type: String, enum: ['select', 'text'], default: 'select' },
    options: [String], // e.g., ["1kg", "2kg"] for select type
    required: { type: Boolean, default: false }
  }],
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

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
