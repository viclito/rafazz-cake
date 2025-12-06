import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    lowercase: true,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  read: {
    type: Boolean,
    default: false,
  },
  reply: {
    type: String,
    default: null,
  },
  repliedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
