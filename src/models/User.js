import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  phone: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
