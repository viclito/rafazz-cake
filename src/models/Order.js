import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
    },
    name: String, // Snapshot of item name
    price: Number, // Snapshot of price at time of order
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedCustomizations: {
      type: Map,
      of: String, // e.g., { "Size": "1kg", "Message": "Happy Birthday" }
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please provide a delivery address'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  specialInstructions: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  adminAssignedTime: {
    type: String, // e.g., "2023-12-25 14:00" or just text
    default: '',
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


export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
