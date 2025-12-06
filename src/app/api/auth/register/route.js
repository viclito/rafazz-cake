import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { sendVerificationEmail } from '@/lib/resend';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Auto-verify in development if Resend is not configured
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const hasResendKey = !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here';
    const autoVerify = isDevelopment && !hasResendKey;

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      verificationToken: autoVerify ? null : verificationToken,
      verificationTokenExpiry: autoVerify ? null : verificationTokenExpiry,
      isVerified: autoVerify, // Auto-verify in dev mode without Resend
    });

    // Send verification email (only if not auto-verified)
    if (!autoVerify) {
      const emailResult = await sendVerificationEmail(email, verificationToken);

      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Still return success as admin was created
      }
    }

    const message = autoVerify 
      ? 'Admin registered successfully! You can now log in immediately (auto-verified in development mode).'
      : 'Admin registered successfully. Please check your email to verify your account.';

    return NextResponse.json(
      {
        message,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register admin' },
      { status: 500 }
    );
  }
}
