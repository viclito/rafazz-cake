import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const admin = await Admin.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    admin.isVerified = true;
    admin.verificationToken = null;
    admin.verificationTokenExpiry = null;
    await admin.save();

    return NextResponse.json(
      { message: 'Email verified successfully. You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
